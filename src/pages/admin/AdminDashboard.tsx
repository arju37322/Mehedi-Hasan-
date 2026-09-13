import { useEffect, useState } from 'react';
import { Users, Briefcase, Folders, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  stats: {
    services: number;
    portfolio: number;
    feedback: number;
    leads: number;
    newLeads: number;
    convertedLeads: number;
  };
  recentLeads: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  const statCards = [
    { name: 'Total Leads', value: data.stats.leads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'New Leads', value: data.stats.newLeads, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Services', value: data.stats.services, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Portfolio Items', value: data.stats.portfolio, icon: Folders, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here's what's happening with your website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
              <div className={`h-12 w-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mr-4 shrink-0`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
          <Link to="/admin/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-slate-200">
          {data.recentLeads.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No leads yet.</div>
          ) : (
            data.recentLeads.map((lead: any) => (
              <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-900">{lead.name}</h4>
                  <p className="text-sm text-slate-500">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{new Date(lead.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
