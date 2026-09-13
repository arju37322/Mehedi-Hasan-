import { apiFetch } from '../../lib/api';
import { useEffect, useState } from 'react';
import { Mail, Phone, Globe, Building, DollarSign, Trash2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  business: string;
  website: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await apiFetch('/api/admin/leads');
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await apiFetch(`/api/admin/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchLeads();
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const deleteLead = async (id: number) => {
    
    await apiFetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    fetchLeads();
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-6">
      {/* Leads List */}
      <div className={`w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${selectedLead ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Leads Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No leads found.</div>
          ) : (
            leads.map(lead => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-900 truncate pr-2">{lead.name}</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-slate-500 truncate mb-2">{lead.email}</div>
                <div className="flex">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Lead Details */}
      <div className={`w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${!selectedLead ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!selectedLead ? (
          <div className="text-slate-400 text-center">
            <Mail size={48} className="mx-auto mb-4 opacity-20" />
            <p>Select a lead to view details</p>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="md:hidden">
                <Button variant="outline" size="sm" onClick={() => setSelectedLead(null)}>Back</Button>
              </div>
              <div className="flex space-x-2 ml-auto">
                <select 
                  className="text-sm border-slate-300 rounded-md py-1.5 pl-3 pr-8"
                  value={selectedLead.status}
                  onChange={(e) => updateStatus(selectedLead.id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
                <Button variant="danger" size="icon" onClick={() => deleteLead(selectedLead.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedLead.name}</h2>
                <p className="text-slate-500 text-sm">Received on {new Date(selectedLead.created_at).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-slate-700">
                    <Mail size={16} className="mr-3 text-slate-400" />
                    <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center text-slate-700">
                      <Phone size={16} className="mr-3 text-slate-400" />
                      <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a>
                    </div>
                  )}
                  {selectedLead.business && (
                    <div className="flex items-center text-slate-700">
                      <Building size={16} className="mr-3 text-slate-400" />
                      {selectedLead.business}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {selectedLead.website && (
                    <div className="flex items-center text-slate-700">
                      <Globe size={16} className="mr-3 text-slate-400" />
                      <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedLead.website}</a>
                    </div>
                  )}
                  {selectedLead.budget && (
                    <div className="flex items-center text-slate-700">
                      <DollarSign size={16} className="mr-3 text-slate-400" />
                      {selectedLead.budget} Budget
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Message</h4>
                <div className="bg-slate-50 p-5 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                  {selectedLead.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
