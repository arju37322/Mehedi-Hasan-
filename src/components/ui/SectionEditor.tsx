import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { ImageUpload } from '@/src/components/ui/ImageUpload';
import { Trash2, Plus } from 'lucide-react';

export function SectionEditor({ items, onChange }: any) {
  const handleAdd = () => onChange([...(items || []), { title: '', text: '', image: '' }]);
  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };
  const handleChange = (index: number, field: string, val: string) => {
    const newItems = [...(items || [])];
    newItems[index] = { ...newItems[index], [field]: val };
    onChange(newItems);
  };
  return (
    <div className="space-y-6">
      {(items || []).map((item: any, i: number) => (
        <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Section Title</label>
              <Input placeholder="e.g. Before Optimization" value={item?.title || ''} onChange={e => handleChange(i, 'title', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Text Content</label>
              <Textarea placeholder="Describe the section..." value={item?.text || ''} onChange={e => handleChange(i, 'text', e.target.value)} rows={3} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Image / Screenshot</label>
              <ImageUpload value={item?.image || ''} onChange={url => handleChange(i, 'image', url)} />
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="text-red-500 absolute top-2 right-2" onClick={() => handleRemove(i)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
        <Plus size={16} className="mr-2" /> Add Section
      </Button>
    </div>
  );
}
