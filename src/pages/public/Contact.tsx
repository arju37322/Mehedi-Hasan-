import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', business: '', website: '', service: '', budget: '', message: ''
  });
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', business: '', website: '', service: '', budget: '', message: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Let's Work Together</h1>
          <p className="text-lg text-slate-600">Ready to scale your business? Fill out the form below and I'll get back to you within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mr-4 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <a href={`mailto:${settings.contact_email || 'hello@mehedihasan.com'}`} className="text-slate-900 font-medium hover:text-blue-600 transition-colors">
                      {settings.contact_email || 'hello@mehedihasan.com'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mr-4 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Phone / WhatsApp</p>
                    <a href={`tel:${settings.contact_phone || '+1234567890'}`} className="text-slate-900 font-medium hover:text-blue-600 transition-colors">
                      {settings.contact_phone || '+1 234 567 890'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
              {success ? (
                <div className="text-center py-12">
                  <div className="inline-flex h-16 w-16 bg-green-100 rounded-full items-center justify-center text-green-600 mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-600 mb-8">Thank you! Your message has been received. I'll get back to you as soon as possible.</p>
                  <Button onClick={() => setSuccess(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone / WhatsApp</label>
                      <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                      <Input name="business" value={formData.business} onChange={handleChange} placeholder="Company Ltd." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>
                      <Input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Ad Budget</label>
                      <select 
                        name="budget" 
                        value={formData.budget} 
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      >
                        <option value="">Select budget</option>
                        <option value="Under $500">Under $500</option>
                        <option value="$500 - $1,000">$500 - $1,000</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000+">$10,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">How can I help you? *</label>
                    <Textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      rows={5}
                      placeholder="Tell me about your business goals and what you're looking to achieve..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
