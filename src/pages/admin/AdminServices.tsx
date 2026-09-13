import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { ImageUpload } from '@/src/components/ui/ImageUpload';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<any>({});

  const fetchServices = () => fetch('/api/services').then(res => res.json()).then(data => { if(Array.isArray(data)) setServices(data); }).catch(console.error);

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentService.id ? 'PUT' : 'POST';
    const url = currentService.id ? `/api/admin/services/${currentService.id}` : '/api/admin/services';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentService)
    });
    
    setIsEditing(false);
    setCurrentService({});
    fetchServices();
  };

  const handleDelete = async (id: number) => {
    
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{currentService.id ? 'Edit Service' : 'Add Service'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X size={20} /></Button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><Input required value={currentService.title || ''} onChange={e => setCurrentService({...currentService, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} /></div>
          <div><label className="block text-sm font-medium mb-1">Slug</label><Input required value={currentService.slug || ''} onChange={e => setCurrentService({...currentService, slug: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Image</label><ImageUpload value={currentService.image_url || ''} onChange={url => setCurrentService({...currentService, image_url: url})} /></div>
          <div><label className="block text-sm font-medium mb-1">Short Description</label><Textarea required value={currentService.short_description || ''} onChange={e => setCurrentService({...currentService, short_description: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Benefits (comma separated)</label><Textarea value={currentService.benefits || ''} onChange={e => setCurrentService({...currentService, benefits: e.target.value})} /></div>
          <Button type="submit">Save Service</Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Services</h1>
        <Button onClick={() => { setCurrentService({}); setIsEditing(true); }}><Plus size={18} className="mr-2" />Add Service</Button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {services.map(service => (
            <div key={service.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-500">{service.short_description}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => { setCurrentService(service); setIsEditing(true); }}><Edit2 size={16} /></Button>
                <Button variant="danger" size="icon" onClick={() => handleDelete(service.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
