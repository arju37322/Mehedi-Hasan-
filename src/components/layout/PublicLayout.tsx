import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Client Feedback', path: '/feedback' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            {settings.site_logo ? (
              <img src={settings.site_logo} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain" />
            ) : null}
            <span>{settings.site_name || <><span className="text-slate-900">Mehedi</span><span className="text-blue-600">Hasan</span></>}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild>
              <Link to="/contact">Let's Work Together</Link>
            </Button>
          </nav>

          <button
            className="md:hidden p-2 -mr-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 bg-white"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium ${
                    location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button asChild className="w-full">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  Let's Work Together
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{settings.site_name || 'Mehedi Hasan'}</h3>
            <p className="text-slate-400 max-w-sm">
              {settings.footer_about || "Digital Marketer & Meta Ads Tracking Specialist helping businesses grow with data-driven strategies."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              {settings.linkedin_url && settings.linkedin_url !== '#' && <li><a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a></li>}
              {settings.facebook_url && settings.facebook_url !== '#' && <li><a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Facebook</a></li>}
              {settings.instagram_url && settings.instagram_url !== '#' && <li><a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Instagram</a></li>}
              {settings.youtube_url && settings.youtube_url !== '#' && <li><a href={settings.youtube_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">YouTube</a></li>}
              {settings.contact_email && <li><a href={`mailto:${settings.contact_email}`} className="hover:text-blue-400 transition-colors">Email</a></li>}
              {settings.contact_phone && <li><a href={`tel:${settings.contact_phone}`} className="hover:text-blue-400 transition-colors">WhatsApp / Phone</a></li>}
            </ul>
            <div className="mt-8">
              <Link to="/admin" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          {settings.footer_copyright || `© ${new Date().getFullYear()} Md Mehedi Hasan. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
}
