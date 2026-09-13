import { useEffect, useState } from 'react';
import { Target, BarChart, Settings, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';

export default function About() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  }, []);

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="lg:w-1/2">
            <div className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 relative flex items-center justify-center">
              {settings.about_image ? (
                <img src={settings.about_image} alt="About Mehedi Hasan" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 text-center p-8">
                  <p className="font-medium text-lg mb-2">Profile Image</p>
                  <p className="text-sm">Configure About Image URL in Admin Settings.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">About Mehedi Hasan</h1>
            <h2 className="text-xl font-medium text-blue-600">Digital Marketer & Meta Ads Tracking Specialist</h2>
            
            <div className="text-lg text-slate-600 leading-relaxed space-y-4">
              <p>
                {settings.about_text || "I help businesses generate better results through strategic Meta Ads, accurate tracking, and data-driven digital marketing."}
              </p>
              <p>
                My approach is centered around measurable business growth. Traffic and clicks are meaningless without conversions and a strong return on ad spend (ROAS).
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Core Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {['Meta Ads Manager', 'Conversion API', 'Meta Pixel', 'Google Analytics 4', 'Google Tag Manager', 'Retargeting', 'ROAS Optimization'].map(skill => (
                  <span key={skill} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-6">
              <Button size="lg" asChild>
                <Link to="/contact">Let's Work Together <ArrowRight size={18} className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <Target className="h-10 w-10 text-blue-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Data-Driven Strategy</h3>
            <p className="text-slate-600">No guesswork. Every campaign decision is backed by solid data and aligned with your core business objectives.</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <Settings className="h-10 w-10 text-blue-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Accurate Tracking</h3>
            <p className="text-slate-600">Flawless pixel and Conversion API setup ensuring you measure what matters and feed quality data to the ad algorithms.</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <BarChart className="h-10 w-10 text-blue-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conversion Focused</h3>
            <p className="text-slate-600">Optimizing for high-intent actions—purchases and qualified leads—rather than just cheap vanity metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
