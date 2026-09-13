import { apiFetch } from '../../lib/api';
import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';

import { ImageUpload } from '@/src/components/ui/ImageUpload';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(setSettings);
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await apiFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-500 mt-1">Manage global website content and links.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">General / Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                <Input 
                  value={settings.site_name || ''} 
                  onChange={(e) => handleChange('site_name', e.target.value)} 
                  placeholder="e.g. Mehedi Hasan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Site Logo (Optional)</label>
                <ImageUpload value={settings.site_logo || ''} onChange={(url) => handleChange('site_logo', url)} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Hero Section</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image</label>
              <ImageUpload value={settings.hero_image || ''} onChange={(url) => handleChange('hero_image', url)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Headline</label>
              <Input 
                value={settings.hero_headline || ''} 
                onChange={(e) => handleChange('hero_headline', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Description</label>
              <Textarea 
                value={settings.hero_description || ''} 
                onChange={(e) => handleChange('hero_description', e.target.value)} 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Button Text</label>
                <Input value={settings.hero_cta_1_text || ''} onChange={(e) => handleChange('hero_cta_1_text', e.target.value)} placeholder="Book a Free Consultation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Button Link</label>
                <Input value={settings.hero_cta_1_link || ''} onChange={(e) => handleChange('hero_cta_1_link', e.target.value)} placeholder="/contact" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Button Text</label>
                <Input value={settings.hero_cta_2_text || ''} onChange={(e) => handleChange('hero_cta_2_text', e.target.value)} placeholder="View My Portfolio" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Button Link</label>
                <Input value={settings.hero_cta_2_link || ''} onChange={(e) => handleChange('hero_cta_2_link', e.target.value)} placeholder="/portfolio" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Contact & Social</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <Input value={settings.contact_email || ''} onChange={(e) => handleChange('contact_email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone / WhatsApp</label>
                <Input value={settings.contact_phone || ''} onChange={(e) => handleChange('contact_phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                <Input value={settings.linkedin_url || ''} onChange={(e) => handleChange('linkedin_url', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                <Input value={settings.facebook_url || ''} onChange={(e) => handleChange('facebook_url', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
                <Input value={settings.instagram_url || ''} onChange={(e) => handleChange('instagram_url', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
                <Input value={settings.youtube_url || ''} onChange={(e) => handleChange('youtube_url', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">About Section</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About Image</label>
              <ImageUpload value={settings.about_image || ''} onChange={(url) => handleChange('about_image', url)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About Text</label>
              <Textarea 
                value={settings.about_text || ''} 
                onChange={(e) => handleChange('about_text', e.target.value)} 
                rows={5}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Bottom CTA Section</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA Headline</label>
              <Input 
                value={settings.cta_headline || ''} 
                onChange={(e) => handleChange('cta_headline', e.target.value)} 
                placeholder="Ready to Grow Your Business..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA Text</label>
              <Textarea 
                value={settings.cta_text || ''} 
                onChange={(e) => handleChange('cta_text', e.target.value)} 
                rows={2}
                placeholder="Let's discuss your goals..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Footer</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Footer About Text</label>
              <Textarea 
                value={settings.footer_about || ''} 
                onChange={(e) => handleChange('footer_about', e.target.value)} 
                rows={3}
                placeholder="Digital Marketer & Meta Ads Tracking Specialist helping businesses grow with data-driven strategies."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Copyright Text</label>
              <Input 
                value={settings.footer_copyright || ''} 
                onChange={(e) => handleChange('footer_copyright', e.target.value)} 
                placeholder="© 2026 Md Mehedi Hasan. All rights reserved."
              />
            </div>
          </div>

        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {success ? <span className="text-green-600 font-medium text-sm">Settings saved successfully!</span> : <span />}
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
