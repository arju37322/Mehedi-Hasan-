import { apiFetch } from '../../lib/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Target, ShieldCheck, Zap, Star, TrendingUp, MousePointerClick, Activity, ChevronDown } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { motion } from 'framer-motion';

export default function Home() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    apiFetch('/api/settings').then(res => res.json()).then(setSettings);
    apiFetch('/api/services').then(res => res.json()).then(data => setServices(data.slice(0, 4)));
    apiFetch('/api/testimonials').then(res => res.json()).then(data => setTestimonials(data.slice(0, 3)));
    apiFetch('/api/faqs').then(res => res.json()).then(setFaqs);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-36 md:pb-40 overflow-hidden bg-[#0B0F19]">
        {/* Digital Marketing / Analytics Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />
        
        {/* Glowing Data/Growth Nodes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />
        
        {/* Decorative Growth Chart SVG */}
        <div className="absolute right-[10%] top-[20%] opacity-20 pointer-events-none hidden lg:block">
           <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 250 L100 150 L200 180 L350 50" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
             <circle cx="100" cy="150" r="5" fill="#0B0F19" stroke="#06b6d4" strokeWidth="3"/>
             <circle cx="200" cy="180" r="5" fill="#0B0F19" stroke="#06b6d4" strokeWidth="3"/>
             <circle cx="350" cy="50" r="6" fill="#06b6d4" className="animate-pulse" />
           </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 shadow-sm mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-sm font-medium text-slate-300">Digital Marketer | Meta Ads & Tracking Specialist</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6"
              >
                {settings.hero_headline || "Turn Ad Spend Into Measurable Business Growth"}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl"
              >
                {settings.hero_description || "I help businesses grow with high-performance Meta Ads, accurate conversion tracking, retargeting and data-driven optimization."}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Button size="lg" className="w-full sm:w-auto text-base bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                  <Link to={settings.hero_cta_1_link || "/contact"}>{settings.hero_cta_1_text || "Book a Free Consultation"}</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" asChild>
                  <Link to={settings.hero_cta_2_link || "/portfolio"}>{settings.hero_cta_2_text || "View My Portfolio"}</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-[2rem] blur-2xl transform rotate-3" />
              
              {/* Floating Element 1 - ROAS */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-12 -left-12 z-20 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 hidden xl:flex"
              >
                <div className="bg-green-500/20 p-2.5 rounded-xl">
                  <TrendingUp className="text-green-400" size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Avg. ROAS</div>
                  <div className="text-2xl font-bold text-white">3.5x<span className="text-green-400 text-lg">+</span></div>
                </div>
              </motion.div>

              {/* Floating Element 2 - Conversions */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-16 -right-8 z-20 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 hidden xl:flex"
              >
                <div className="bg-cyan-500/20 p-2.5 rounded-xl">
                  <MousePointerClick className="text-cyan-400" size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Conversions</div>
                  <div className="text-2xl font-bold text-white">+42<span className="text-cyan-400 text-lg">%</span></div>
                </div>
              </motion.div>

              {/* Floating Element 3 - Background Icon */}
              <motion.div 
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/3 -right-12 z-0"
              >
                 <Activity className="text-cyan-500/20" size={100} />
              </motion.div>

              <img 
                src={settings.hero_image || "/assets/my-pic-website.png"} 
                alt={settings.site_name || "Mehedi Hasan - Digital Marketing Expert"} 
                className="relative z-10 w-full max-w-md mx-auto object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Target, label: "Meta Ads Strategy" },
              { icon: BarChart3, label: "Conversion Tracking" },
              { icon: Zap, label: "Data-Driven Optimization" },
              { icon: ShieldCheck, label: "Performance Focused" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-slate-100">
                  <item.icon size={24} />
                </div>
                <h4 className="font-semibold text-slate-900">{item.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How I Can Help You Grow</h2>
            <p className="text-lg text-slate-600">Comprehensive digital marketing solutions focused on maximizing your return on investment.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 line-clamp-3">{service.short_description}</p>
                <div className="mt-auto">
                  <Link to="/services" className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Get Started <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Client Feedback</h2>
              <p className="text-lg text-slate-600">See what business owners say about working with me.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-700 mb-8 flex-1 italic">"{testimonial.feedback}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    {testimonial.photo ? (
                      <img src={testimonial.photo} alt={testimonial.client_name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                        {testimonial.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.client_name}</h4>
                      {testimonial.company && <p className="text-sm text-slate-500">{testimonial.company}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Proven Workflow</h2>
            <p className="text-lg text-slate-600">A systematic approach to building and scaling profitable ad campaigns.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Discovery", desc: "Understand your business, goals, offer, and target audience." },
              { num: "02", title: "Strategy", desc: "Develop a custom advertising and comprehensive tracking strategy." },
              { num: "03", title: "Launch", desc: "Build campaigns, implement tracking, and deploy creatives." },
              { num: "04", title: "Optimize", desc: "Analyze performance data and continuously improve results." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-slate-100 mb-4">{step.num}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-slate-600">Got questions? I've got answers.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:bg-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                    <ChevronDown className={`shrink-0 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 text-slate-600">
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {settings.cta_headline || "Ready to Grow Your Business With Smarter Digital Marketing?"}
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            {settings.cta_text || "Let's discuss your goals and find the right advertising and tracking strategy for your business."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link to="/contact">Book a Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800" asChild>
              <Link to="/contact">Send a Message</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
