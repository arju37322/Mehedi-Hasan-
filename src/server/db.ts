import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'database.json');

let dbState: any = null;

async function saveDb() {
  await fs.writeFile(dbPath, JSON.stringify(dbState, null, 2), 'utf-8');
}

export async function getDb() {
  if (dbState) return createDbInterface();

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    dbState = JSON.parse(data);
  } catch (err) {
    dbState = {
      users: [],
      services: [],
      portfolio: [],
      testimonials: [],
      leads: [],
      settings: [],
      faqs: []
    };
  }

  await seedDb();
  return createDbInterface();
}

function createDbInterface() {
  return {
    async get(query: string, params: any[] = []) {
      const match = query.match(/SELECT \* FROM (\w+) WHERE (\w+) = \?/i);
      if (match) {
        const [, table, col] = match;
        return dbState[table].find((r: any) => r[col] === params[0]);
      }
      
      const countMatch = query.match(/SELECT COUNT\(\*\) as c FROM (\w+)(?: WHERE (\w+) = "(.*?)")?/i);
      if (countMatch) {
        const [, table, col, val] = countMatch;
        let items = dbState[table];
        if (col && val) items = items.filter((r: any) => r[col] === val);
        return { c: items.length };
      }
      
      if (query.match(/SELECT COUNT\(\*\) as count FROM/)) {
         const table = query.split('FROM ')[1].trim();
         return { count: dbState[table]?.length || 0 };
      }

      return null;
    },
    
    async all(query: string, params: any[] = []) {
      const match = query.match(/SELECT \* FROM (\w+)/i);
      if (match) {
        const table = match[1];
        let res = [...(dbState[table] || [])];
        if (query.includes('WHERE active = 1')) res = res.filter(r => r.active === 1);
        if (query.includes('WHERE published = 1')) res = res.filter(r => r.published === 1);
        if (query.includes('ORDER BY display_order ASC, created_at DESC')) {
          res.sort((a, b) => (a.display_order - b.display_order) || (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else if (query.includes('ORDER BY project_date DESC, created_at DESC')) {
          res.sort((a, b) => {
            const dateA = a.project_date ? new Date(a.project_date).getTime() : new Date(a.created_at).getTime();
            const dateB = b.project_date ? new Date(b.project_date).getTime() : new Date(b.created_at).getTime();
            return dateB - dateA;
          });
        } else if (query.includes('ORDER BY created_at DESC')) {
          res.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        if (query.includes('LIMIT')) {
          const limit = parseInt(query.split('LIMIT')[1].trim());
          res = res.slice(0, limit);
        }
        return res;
      }
      return [];
    },
    
    async run(query: string, params: any[] = []) {
      const insertMatch = query.match(/INSERT INTO (\w+) \((.*?)\) VALUES/i);
      if (insertMatch) {
        const table = insertMatch[1];
        const cols = insertMatch[2].split(',').map(c => c.trim());
        const row: any = { id: Date.now() + Math.floor(Math.random() * 1000), created_at: new Date().toISOString() };
        cols.forEach((c, i) => row[c] = params[i]);
        dbState[table].push(row);
        await saveDb();
        return;
      }
      
      const insertSettingsMatch = query.match(/INSERT INTO settings \(key, value\) VALUES \(\?, \?\) ON CONFLICT/i);
      if (insertSettingsMatch) {
        const existing = dbState.settings.find((s:any) => s.key === params[0]);
        if (existing) existing.value = params[1];
        else dbState.settings.push({ key: params[0], value: params[1] });
        await saveDb();
        return;
      }

      const updateMatch = query.match(/UPDATE (\w+) SET (.*?) WHERE id\s*=\s*\?/i);
      if (updateMatch) {
        const table = updateMatch[1];
        const sets = updateMatch[2].split(',').map(s => s.trim().split('=')[0].trim());
        const id = params[params.length - 1];
        const row = dbState[table].find((r:any) => r.id === parseInt(id));
        if (row) {
          sets.forEach((c, i) => row[c] = params[i]);
          await saveDb();
        }
        return;
      }
      
      const updatePassword = query.match(/UPDATE users SET password_hash = \? WHERE username = \?/i);
      if (updatePassword) {
        const user = dbState.users.find((u:any) => u.username === params[1]);
        if (user) {
          user.password_hash = params[0];
          await saveDb();
        }
        return;
      }
      
      const updateLead = query.match(/UPDATE leads SET status = \? WHERE id = \?/i);
      if(updateLead) {
        const lead = dbState.leads.find((l:any) => l.id == params[1]);
        if(lead) {
          lead.status = params[0];
          await saveDb();
        }
        return;
      }
      
      const deleteMatch = query.match(/DELETE FROM (\w+) WHERE id = \?/i);
      if (deleteMatch) {
        const table = deleteMatch[1];
        dbState[table] = dbState[table].filter((r:any) => r.id != params[0]);
        await saveDb();
        return;
      }
    }
  };
}

async function seedDb() {
  // Check if admin exists
  const admin = dbState.users.find((u:any) => u.username === 'MehediHasan');
  if (!admin) {
    const hash = await bcrypt.hash('*Mehedi2003#', 10);
    dbState.users.push({ id: 1, username: 'MehediHasan', password_hash: hash, created_at: new Date().toISOString() });
    await saveDb();
  }

  // Seed default settings
  if (dbState.settings.length === 0) {
    const defaultSettings = [
      ['hero_headline', 'Turn Ad Spend Into Measurable Business Growth'],
      ['hero_description', 'I help businesses grow with high-performance Meta Ads, accurate conversion tracking, retargeting and data-driven optimization.'],
      ['about_text', 'I am a data-driven Digital Marketer specializing in Meta Ads, Conversion Tracking, and creating scalable advertising strategies.'],
      ['contact_email', 'hello@mehedihasan.com'],
      ['contact_phone', '+1234567890'],
      ['linkedin_url', '#'],
      ['facebook_url', '#'],
      ['instagram_url', '#'],
      ['youtube_url', '#'],
      ['whatsapp_url', '#']
    ];
    for (const [key, value] of defaultSettings) {
      dbState.settings.push({ key, value });
    }
    await saveDb();
  }

  // Seed default services if empty
  if (dbState.services.length === 0) {
    const services = [
      ['Meta Ads Management', 'meta-ads-management', 'Target', 'Campaign strategy, setup, optimization and scaling.', 'Full-funnel strategy, audience targeting, creative testing, ROAS optimization.', 1, 1],
      ['Conversion Tracking', 'conversion-tracking', 'Activity', 'Accurate event tracking and conversion measurement.', 'Pixel setup, standard/custom events, deduplication, accurate data.', 1, 2],
      ['Conversion API (CAPI)', 'conversion-api', 'Server', 'Server-side tracking implementation to improve data quality.', 'Bypass ad blockers, improve attribution, higher match rates.', 1, 3],
      ['Retargeting Campaigns', 'retargeting', 'Repeat', 'Re-engage high-intent website visitors and potential customers.', 'Lower CPA, higher conversion rates, dynamic product ads.', 0, 4]
    ];
    for (const [title, slug, icon, short_desc, benefits, featured, order] of services) {
      dbState.services.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        title, slug, icon, short_description: short_desc, benefits, featured, display_order: order, active: 1, created_at: new Date().toISOString()
      });
    }
    await saveDb();
  }

  // Seed default FAQs if empty
  if (!dbState.faqs) {
    dbState.faqs = [];
  }
  if (dbState.faqs.length === 0) {
    const faqs = [
      ['What services do you offer?', 'I specialize in Meta Ads Management, Conversion Tracking, and Retargeting campaigns tailored to help businesses grow and maximize ROI.', 1, 1],
      ['Do you offer guarantees on ad performance?', 'While I cannot guarantee specific ROAS or conversions due to market variables, I do guarantee data-driven strategies, rigorous testing, and continuous optimization to achieve the best possible results.', 2, 1],
      ['What is your minimum ad spend requirement?', 'I typically work with clients who have a minimum monthly ad budget of $500, though this can vary based on your specific goals and industry.', 3, 1],
      ['How do you track conversions?', 'I implement both browser-side (Meta Pixel) and server-side tracking (Conversion API) to ensure accurate data collection, better attribution, and improved ad optimization.', 4, 1]
    ];
    for (const [question, answer, display_order, published] of faqs) {
      dbState.faqs.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        question, answer, display_order, published, created_at: new Date().toISOString()
      });
    }
    await saveDb();
  }
}
