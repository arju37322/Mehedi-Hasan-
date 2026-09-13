import { apiFetch } from '../../lib/api';
import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-max">
          <img src={value} alt="Uploaded" className="h-32 w-auto object-cover rounded-md border border-slate-200 shadow-sm" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-white text-slate-500 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="h-32 w-48 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50/50"
        >
          {isUploading ? (
            <Loader2 size={24} className="animate-spin mb-2" />
          ) : (
            <>
              <Upload size={24} className="mb-2" />
              <span className="text-sm font-medium">Click to upload image</span>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex items-center gap-2 mt-1">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Or enter image path (e.g. /assets/image.png)" 
          className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
        />
      </div>
    </div>
  );
}
