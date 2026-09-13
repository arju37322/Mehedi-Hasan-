import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services').then(res => res.json()).then(setServices);
  }, []);

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Expert Digital Services</h1>
          <p className="text-lg text-slate-600">Data-driven strategies and meticulous execution to scale your business profitably.</p>
        </div>

        <div className="space-y-8">
          {services.map((service, i) => (
            <div key={service.id} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex h-12 w-12 bg-blue-50 rounded-xl items-center justify-center text-blue-600 mb-6">
                  <span className="font-bold text-xl">{i + 1}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
                <p className="text-slate-600 mb-6 text-lg">{service.short_description}</p>
                
                {service.benefits && (
                  <ul className="space-y-3 mb-8">
                    {service.benefits.split(',').map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start text-slate-700">
                        <CheckCircle2 size={20} className="text-blue-600 mr-3 mt-0.5 shrink-0" />
                        <span>{benefit.trim()}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <Link to="/contact" className="inline-flex items-center text-base font-bold text-blue-600 hover:text-blue-700 group">
                  Get Started <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              {service.image_url && (
                <div className="md:w-1/3 shrink-0">
                  <div className="aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden border border-slate-100">
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
