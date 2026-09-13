import { apiFetch } from '../../lib/api';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function CaseStudy() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const safeParse = (str: any) => {
    if (typeof str !== 'string') return str || [];
    try { return JSON.parse(str); } catch (e) { return []; }
  };

  useEffect(() => {
    apiFetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.slug === slug);
        if (found) {
          found.scope_of_work = safeParse(found.scope_of_work);
          found.approach = safeParse(found.approach);
          found.why_work_with_me = safeParse(found.why_work_with_me);
          found.custom_sections = safeParse(found.custom_sections);
          setProject(found);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (!project) return <div className="py-24 text-center">Project not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/portfolio" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
          </Link>
          
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">CASE STUDY</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                {project.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-100">
            <div>
              <span className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">PROJECT</span>
              <span className="text-slate-900 font-medium">{project.client || '-'}</span>
            </div>
            <div>
              <span className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">INDUSTRY</span>
              <span className="text-slate-900 font-medium">{project.industry || '-'}</span>
            </div>
            <div>
              <span className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">SERVICE</span>
              <span className="text-slate-900 font-medium">{project.category || '-'}</span>
            </div>
          </div>
          
          {(project.thumbnail || project.image) && (
            <div className="mt-12 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <img src={project.thumbnail || project.image} alt={project.title} className="w-full h-auto max-h-[70vh] object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Objective */}
      {project.objective && (
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">OBJECTIVE</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Project Objective</h2>
            </div>
            <div className="md:w-2/3">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{project.objective}</p>
            </div>
          </div>
        </section>
      )}

      {/* Scope of Work */}
      {project.scope_of_work && project.scope_of_work.length > 0 && (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">SCOPE OF WORK</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-12">What I Optimized</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.scope_of_work.map((item: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <span className="text-slate-300 font-mono text-sm mb-4 block">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {project.custom_sections && project.custom_sections.map((section: any, idx: number) => (
        <section key={idx} className={`py-20 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100`}>
          <div className="container mx-auto px-4 max-w-5xl space-y-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">{section.title}</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">{section.title}</h2>
              {section.text && <p className="text-slate-600 leading-relaxed max-w-3xl whitespace-pre-wrap">{section.text}</p>}
            </div>
            {section.image && (
              <div className="bg-slate-100 p-4 md:p-8 rounded-3xl">
                <img src={section.image} alt={section.title} className="w-full h-auto rounded-xl shadow-lg border border-slate-200" />
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Approach */}
      {project.approach && project.approach.length > 0 && (
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">APPROACH</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-12">My Approach</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {project.approach.map((item: any, i: number) => (
                <div key={i} className="space-y-4 border-t-2 border-slate-900 pt-6">
                  <span className="text-slate-400 font-mono text-sm block">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Work With Me */}
      {project.why_work_with_me && project.why_work_with_me.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">WHY WORK WITH ME</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-12">Why Work With Me</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.why_work_with_me.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-slate-900 rounded-3xl p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Improve Your<br/>Online Presence?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Let's discuss your business goals and find the right digital marketing strategy.
            </p>
            <Link to="/contact" className="inline-block bg-white text-slate-900 font-bold px-8 py-3 rounded-full hover:bg-slate-100 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
