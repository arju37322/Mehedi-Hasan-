import React from 'react';
import { X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative w-max">
          <img src={value} alt="Image Preview" className="h-32 w-auto object-cover rounded-md border border-slate-200 shadow-sm" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-white text-slate-500 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex flex-col gap-1 mt-1">
        <input 
          type="url" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Paste image URL here (e.g., from LinkedIn, ImgBB, etc.)" 
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          For Netlify deployments, direct file uploads are not supported. Please upload your images to a free host like <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">ImgBB</a> or copy the image address from your LinkedIn/Facebook profile, and paste the link here.
        </p>
      </div>
    </div>
  );
}
