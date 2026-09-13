import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { getDb } from './src/server/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Initialize DB
  const db = await getDb();

  // Middleware for checking admin
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Configure file upload
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
  });
  const upload = multer({ storage });

  app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // --- AUTH ROUTES ---
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('admin_token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, username: user.username });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', requireAdmin, (req, res) => {
    res.json({ authenticated: true });
  });

  app.post('/api/auth/change-password', requireAdmin, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ error: 'Password too short' });
    const hash = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password_hash = ? WHERE username = ?', [hash, 'MehediHasan']);
    res.json({ success: true });
  });

  // --- PUBLIC API ROUTES ---
  app.get('/api/services', async (req, res) => {
    const services = await db.all('SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC, created_at DESC');
    res.json(services);
  });

  app.get('/api/portfolio', async (req, res) => {
    const portfolio = await db.all('SELECT * FROM portfolio WHERE published = 1 ORDER BY project_date DESC, created_at DESC');
    res.json(portfolio);
  });

  app.get('/api/testimonials', async (req, res) => {
    const testimonials = await db.all('SELECT * FROM testimonials WHERE published = 1 ORDER BY created_at DESC');
    res.json(testimonials);
  });

  app.get('/api/settings', async (req, res) => {
    const settingsRows = await db.all('SELECT * FROM settings');
    const settings = settingsRows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
  });

  app.get('/api/faqs', async (req, res) => {
    const faqs = await db.all('SELECT * FROM faqs WHERE published = 1 ORDER BY display_order ASC, created_at DESC');
    res.json(faqs);
  });

  app.post('/api/leads', async (req, res) => {
    const { name, email, phone, business, website, service, budget, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Required fields missing' });
    
    await db.run(
      'INSERT INTO leads (name, email, phone, business, website, service, budget, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, business, website, service, budget, message]
    );

    // Send email to the admin
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: 'mehedihasanofficial.mkt@gmail.com',
          subject: `New Lead from ${name} - ${business || 'Website'}`,
          html: `
            <h2>New Lead Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Business:</strong> ${business || 'N/A'}</p>
            <p><strong>Website:</strong> ${website || 'N/A'}</p>
            <p><strong>Interested Service:</strong> ${service || 'N/A'}</p>
            <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
            <h3>Message:</h3>
            <p>${message}</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Lead email sent successfully');
      } catch (emailError) {
        console.error('Failed to send lead email:', emailError);
      }
    }

    res.json({ success: true });
  });

  // --- ADMIN API ROUTES ---
  app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
    const [services, portfolio, feedback, leads, newLeads, converted] = await Promise.all([
      db.get('SELECT COUNT(*) as c FROM services'),
      db.get('SELECT COUNT(*) as c FROM portfolio'),
      db.get('SELECT COUNT(*) as c FROM testimonials'),
      db.get('SELECT COUNT(*) as c FROM leads'),
      db.get('SELECT COUNT(*) as c FROM leads WHERE status = "New"'),
      db.get('SELECT COUNT(*) as c FROM leads WHERE status = "Converted"'),
    ]);
    const recentLeads = await db.all('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5');
    res.json({
      stats: {
        services: services.c,
        portfolio: portfolio.c,
        feedback: feedback.c,
        leads: leads.c,
        newLeads: newLeads.c,
        convertedLeads: converted.c
      },
      recentLeads
    });
  });

  app.get('/api/admin/leads', requireAdmin, async (req, res) => {
    const leads = await db.all('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(leads);
  });

  app.put('/api/admin/leads/:id', requireAdmin, async (req, res) => {
    const { status } = req.body;
    await db.run('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  });

  app.delete('/api/admin/leads/:id', requireAdmin, async (req, res) => {
    await db.run('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  // Services CRUD
  app.post('/api/admin/services', requireAdmin, async (req, res) => {
    const { title, slug, icon, image_url, short_description, description, benefits, featured, display_order, active } = req.body;
    await db.run(
      'INSERT INTO services (title, slug, icon, image_url, short_description, description, benefits, featured, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, icon, image_url, short_description, description, benefits, featured ? 1 : 0, display_order || 0, active !== false ? 1 : 0]
    );
    res.json({ success: true });
  });

  app.put('/api/admin/services/:id', requireAdmin, async (req, res) => {
    const { title, slug, icon, image_url, short_description, description, benefits, featured, display_order, active } = req.body;
    await db.run(
      'UPDATE services SET title=?, slug=?, icon=?, image_url=?, short_description=?, description=?, benefits=?, featured=?, display_order=?, active=? WHERE id=?',
      [title, slug, icon, image_url, short_description, description, benefits, featured ? 1 : 0, display_order, active ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  });
  app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
    await db.run('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });
  
  // Portfolio CRUD
  app.get('/api/admin/portfolio', requireAdmin, async (req, res) => {
    const portfolio = await db.all('SELECT * FROM portfolio ORDER BY project_date DESC, created_at DESC');
    res.json(portfolio);
  });
  app.post('/api/admin/portfolio', requireAdmin, async (req, res) => {
    const { title, slug, client, category, thumbnail, image, description, subtitle, industry, objective, scope_of_work, custom_sections, approach, why_work_with_me, challenge, strategy, solution, results, metrics, project_date, project_url, featured, published } = req.body;
    await db.run(
      'INSERT INTO portfolio (title, slug, client, category, thumbnail, image, description, subtitle, industry, objective, scope_of_work, custom_sections, approach, why_work_with_me, challenge, strategy, solution, results, metrics, project_date, project_url, featured, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, client, category, thumbnail, image, description, subtitle, industry, objective, JSON.stringify(scope_of_work || []), JSON.stringify(custom_sections || []), JSON.stringify(approach || []), JSON.stringify(why_work_with_me || []), challenge, strategy, solution, results, metrics, project_date, project_url, featured ? 1 : 0, published !== false ? 1 : 0]
    );
    res.json({ success: true });
  });

  app.put('/api/admin/portfolio/:id', requireAdmin, async (req, res) => {
    const { title, slug, client, category, thumbnail, image, description, subtitle, industry, objective, scope_of_work, custom_sections, approach, why_work_with_me, challenge, strategy, solution, results, metrics, project_date, project_url, featured, published } = req.body;
    await db.run(
      'UPDATE portfolio SET title=?, slug=?, client=?, category=?, thumbnail=?, image=?, description=?, subtitle=?, industry=?, objective=?, scope_of_work=?, custom_sections=?, approach=?, why_work_with_me=?, challenge=?, strategy=?, solution=?, results=?, metrics=?, project_date=?, project_url=?, featured=?, published=? WHERE id=?',
      [title, slug, client, category, thumbnail, image, description, subtitle, industry, objective, JSON.stringify(scope_of_work || []), JSON.stringify(custom_sections || []), JSON.stringify(approach || []), JSON.stringify(why_work_with_me || []), challenge, strategy, solution, results, metrics, project_date, project_url, featured ? 1 : 0, published ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  });
  app.delete('/api/admin/portfolio/:id', requireAdmin, async (req, res) => {
    await db.run('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  // Testimonials CRUD
  app.get('/api/admin/testimonials', requireAdmin, async (req, res) => {
    const testimonials = await db.all('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(testimonials);
  });
  app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
    const { client_name, company, position, photo, feedback, rating, service, date, published } = req.body;
    await db.run(
      'INSERT INTO testimonials (client_name, company, position, photo, feedback, rating, service, date, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client_name, company, position, photo, feedback, rating || 5, service, date, published !== false ? 1 : 0]
    );
    res.json({ success: true });
  });
  app.put('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    const { client_name, company, position, photo, feedback, rating, service, date, published } = req.body;
    await db.run(
      'UPDATE testimonials SET client_name=?, company=?, position=?, photo=?, feedback=?, rating=?, service=?, date=?, published=? WHERE id=?',
      [client_name, company, position, photo, feedback, rating, service, date, published ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  });
  app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    await db.run('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });
  
  // Settings CRUD
  app.put('/api/admin/settings', requireAdmin, async (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
      await db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [key, value]);
    }
    res.json({ success: true });
  });

  // FAQs CRUD
  app.get('/api/admin/faqs', requireAdmin, async (req, res) => {
    const faqs = await db.all('SELECT * FROM faqs ORDER BY display_order ASC, created_at DESC');
    res.json(faqs);
  });
  app.post('/api/admin/faqs', requireAdmin, async (req, res) => {
    const { question, answer, display_order, published } = req.body;
    await db.run(
      'INSERT INTO faqs (question, answer, display_order, published) VALUES (?, ?, ?, ?)',
      [question, answer, display_order || 0, published !== false ? 1 : 0]
    );
    res.json({ success: true });
  });
  app.put('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
    const { question, answer, display_order, published } = req.body;
    await db.run(
      'UPDATE faqs SET question=?, answer=?, display_order=?, published=? WHERE id=?',
      [question, answer, display_order, published ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  });
  app.delete('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
    await db.run('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
