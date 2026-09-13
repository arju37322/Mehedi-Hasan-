import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { ImageUpload } from '@/src/components/ui/ImageUpload';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<any>({});

  const fetchTestimonials = () => fetch('/api/admin/testimonials').then(res => res.json()).then(data => { if(Array.isArray(data)) setTestimonials(data); }).catch(console.error);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentTestimonial.id ? 'PUT' : 'POST';
    const url = currentTestimonial.id ? `/api/admin/testimonials/${currentTestimonial.id}` : '/api/admin/testimonials';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentTestimonial)
    });
    
    setIsEditing(false);
    setCurrentTestimonial({});
    fetchTestimonials();
  };

  const handleDelete = async (id: number) => {
    
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchTestimonials();
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{currentTestimonial.id ? 'Edit Feedback' : 'Add Feedback'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X size={20} /></Button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Client Name</label><Input required value={currentTestimonial.client_name || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, client_name: e.target.value})} /></div>
            <div><label className="block text-sm font-medium mb-1">Company</label><Input value={currentTestimonial.company || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, company: e.target.value})} /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Photo</label><ImageUpload value={currentTestimonial.photo || ''} onChange={url => setCurrentTestimonial({...currentTestimonial, photo: url})} /></div>
          <div><label className="block text-sm font-medium mb-1">Feedback</label><Textarea required value={currentTestimonial.feedback || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, feedback: e.target.value})} /></div>
          <Button type="submit">Save Feedback</Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Testimonials</h1>
        <Button onClick={() => { setCurrentTestimonial({}); setIsEditing(true); }}><Plus size={18} className="mr-2" />Add Feedback</Button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {testimonials.map(item => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">{item.client_name}</h3>
                <p className="text-sm text-slate-500">{item.company}</p>
                <p className="text-sm text-slate-700 mt-1 line-clamp-1">{item.feedback}</p>
              </div>
              <div className="flex space-x-2 shrink-0">
                <Button variant="outline" size="icon" onClick={() => { setCurrentTestimonial(item); setIsEditing(true); }}><Edit2 size={16} /></Button>
                <Button variant="danger" size="icon" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <div className="p-6 text-slate-500 text-center">No testimonials found. Add one above.</div>}
        </div>
      </div>
    </div>
  );
}
