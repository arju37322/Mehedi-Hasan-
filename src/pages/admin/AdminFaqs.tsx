import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<any>({});

  const fetchFaqs = () => fetch('/api/admin/faqs').then(res => res.json()).then(data => { if(Array.isArray(data)) setFaqs(data); }).catch(console.error);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentFaq.id ? 'PUT' : 'POST';
    const url = currentFaq.id ? `/api/admin/faqs/${currentFaq.id}` : '/api/admin/faqs';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentFaq)
    });
    
    setIsEditing(false);
    setCurrentFaq({});
    fetchFaqs();
  };

  const handleDelete = async (id: number) => {
    
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
    fetchFaqs();
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{currentFaq.id ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X size={20} /></Button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <Input required value={currentFaq.question || ''} onChange={e => setCurrentFaq({...currentFaq, question: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Answer</label>
            <Textarea required value={currentFaq.answer || ''} onChange={e => setCurrentFaq({...currentFaq, answer: e.target.value})} rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <Input type="number" value={currentFaq.display_order || 0} onChange={e => setCurrentFaq({...currentFaq, display_order: parseInt(e.target.value)})} />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="published" 
              checked={currentFaq.published !== 0} 
              onChange={e => setCurrentFaq({...currentFaq, published: e.target.checked ? 1 : 0})}
              className="mr-2"
            />
            <label htmlFor="published" className="text-sm font-medium">Published</label>
          </div>
          <Button type="submit">Save FAQ</Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage FAQs</h1>
        <Button onClick={() => { setCurrentFaq({ display_order: 0, published: 1 }); setIsEditing(true); }}>
          <Plus size={18} className="mr-2" />Add FAQ
        </Button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {faqs.map(faq => (
            <div key={faq.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">{faq.question}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{faq.answer}</p>
                {!faq.published && <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Draft</span>}
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="outline" size="icon" onClick={() => { setCurrentFaq(faq); setIsEditing(true); }}><Edit2 size={16} /></Button>
                <Button variant="danger" size="icon" onClick={() => handleDelete(faq.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <div className="p-8 text-center text-slate-500">No FAQs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
