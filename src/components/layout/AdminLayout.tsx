import { apiFetch } from '../../lib/api';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Folders, MessageSquare, Users, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          navigate('/admin/login');
        }
      })
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    navigate('/admin/login');
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/admin/leads', icon: Users },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Portfolio', path: '/admin/portfolio', icon: Folders },
    { name: 'Feedback', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-900">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 md:hidden justify-between">
          <span className="font-bold text-slate-900">Admin</span>
          <button onClick={handleLogout} className="text-sm text-slate-600">Logout</button>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
