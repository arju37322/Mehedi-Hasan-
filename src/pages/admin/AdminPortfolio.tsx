import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { ImageUpload } from '@/src/components/ui/ImageUpload';
import { SectionEditor } from '@/src/components/ui/SectionEditor';
import { Trash2, Edit2, Plus, X, GripVertical } from 'lucide-react';

function ArrayEditor({ items, onChange, titleLabel, descLabel }: any) {
  const handleAdd = () => onChange([...(items || []), { title: '', description: '' }]);
  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };
  const handleChange = (index: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[index][field] = val;
    onChange(newItems);
  };
  return (
    <div className="space-y-3">
      {(items || []).map((item: any, i: number) => (
        <div key={i} className="flex gap-4 items-start p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex-1 space-y-3">
            <Input placeholder={titleLabel} value={item.title || ''} onChange={e => handleChange(i, 'title', e.target.value)} />
            <Textarea placeholder={descLabel} value={item.description || ''} onChange={e => handleChange(i, 'description', e.target.value)} rows={2} />
          </div>
          <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemove(i)}><Trash2 size={16} /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}><Plus size={16} className="mr-2" /> Add Item</Button>
    </div>
  );
}

export default function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({});

  const safeParse = (str: any) => {
    if (typeof str !== 'string') return str || [];
    try { return JSON.parse(str); } catch (e) { return []; }
  };

  const fetchPortfolio = () => fetch('/api/admin/portfolio').then(res => res.json()).then(data => {
    if(Array.isArray(data)) {
      const parsedData = data.map(d => ({
        ...d,
        scope_of_work: safeParse(d.scope_of_work),
        approach: safeParse(d.approach),
        why_work_with_me: safeParse(d.why_work_with_me),
        custom_sections: safeParse(d.custom_sections),
      }));
      setPortfolio(parsedData);
    }
  }).catch(e => console.error("Error fetching portfolio:", e));

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentProject.id ? 'PUT' : 'POST';
    const url = currentProject.id ? `/api/admin/portfolio/${currentProject.id}` : '/api/admin/portfolio';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProject)
    });
    
    setIsEditing(false);
    setCurrentProject({});
    fetchPortfolio();
  };

  const handleDelete = async (id: number) => {
    
    await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    fetchPortfolio();
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2 border-b border-slate-100">
          <h2 className="text-xl font-bold">{currentProject.id ? 'Edit Case Study' : 'Add Case Study'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X size={20} /></Button>
        </div>
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Header & Meta</h3>
            <div><label className="block text-sm font-medium mb-1">Title</label><Input required value={currentProject.title || ''} onChange={e => setCurrentProject({...currentProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} /></div>
            <div><label className="block text-sm font-medium mb-1">Subtitle</label><Input value={currentProject.subtitle || ''} onChange={e => setCurrentProject({...currentProject, subtitle: e.target.value})} /></div>
            
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1">Client (Project)</label><Input value={currentProject.client || ''} onChange={e => setCurrentProject({...currentProject, client: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1">Industry</label><Input value={currentProject.industry || ''} onChange={e => setCurrentProject({...currentProject, industry: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1">Category (Service)</label><Input value={currentProject.category || ''} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} /></div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Card Thumbnail & Cover Image</label>
              <ImageUpload value={currentProject.thumbnail || ''} onChange={url => setCurrentProject({...currentProject, thumbnail: url})} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2">Project Objective</h3>
            <div><Textarea rows={3} value={currentProject.objective || ''} onChange={e => setCurrentProject({...currentProject, objective: e.target.value})} /></div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2">Scope of Work</h3>
            <ArrayEditor items={currentProject.scope_of_work} onChange={(v:any) => setCurrentProject({...currentProject, scope_of_work: v})} titleLabel="Scope Item Title" descLabel="Scope Item Description" />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2">Case Study Sections</h3>
            <p className="text-sm text-slate-500 mb-4">Add sections like "Before Optimization", "SEO Work", or "After Optimization".</p>
            <SectionEditor items={currentProject.custom_sections} onChange={(v:any) => setCurrentProject({...currentProject, custom_sections: v})} />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2">My Approach</h3>
            <ArrayEditor items={currentProject.approach} onChange={(v:any) => setCurrentProject({...currentProject, approach: v})} titleLabel="Step Title (e.g. Research)" descLabel="Description" />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2">Why Work With Me</h3>
            <ArrayEditor items={currentProject.why_work_with_me} onChange={(v:any) => setCurrentProject({...currentProject, why_work_with_me: v})} titleLabel="Reason (e.g. Goal Focused)" descLabel="Description" />
          </div>

          <div className="sticky bottom-0 bg-white py-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit">Save Case Study</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Case Studies</h1>
        <Button onClick={() => { setCurrentProject({}); setIsEditing(true); }}><Plus size={18} className="mr-2" />Add Case Study</Button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {portfolio.map(project => (
            <div key={project.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                {project.thumbnail ? <img src={project.thumbnail} className="w-16 h-12 object-cover rounded-md" /> : <div className="w-16 h-12 bg-slate-200 rounded-md"></div>}
                <div>
                  <h3 className="font-bold text-slate-900">{project.title}</h3>
                  <p className="text-sm text-slate-500">{project.category} • {project.client}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => { setCurrentProject(project); setIsEditing(true); }}><Edit2 size={16} /></Button>
                <Button variant="danger" size="icon" onClick={() => handleDelete(project.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
          {portfolio.length === 0 && <div className="p-6 text-slate-500 text-center">No projects found. Add one above.</div>}
        </div>
      </div>
    </div>
  );
}
