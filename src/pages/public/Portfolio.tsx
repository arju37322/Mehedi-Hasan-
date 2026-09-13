import { apiFetch } from '../../lib/api';
import { useEffect, useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/portfolio').then(res => res.json()).then(setProjects);
  }, []);

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Proven Results</h1>
          <p className="text-lg text-slate-600">Explore how I've helped businesses achieve exceptional growth through data-driven advertising and tracking.</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-3xl border border-slate-200">
            Portfolio projects will appear here soon.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {project.thumbnail || project.image ? (
                    <img src={project.thumbnail || project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                      {project.category || 'Portfolio Image'}
                    </div>
                  )}
                  {project.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                      {project.category}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{project.description || project.client}</p>
                  </div>
                  
                  {project.metrics && (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="font-medium text-slate-900 text-sm">{project.metrics}</div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Link to={`/portfolio/${project.slug}`} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700">
                      View Case Study <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
