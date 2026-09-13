import { useEffect, useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';

export default function ClientFeedback() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(setTestimonials)
      .catch(console.error);
  }, []);

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Client Feedback</h1>
          <p className="text-lg text-slate-600">See what our clients say about the impact of our data-driven strategies.</p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <MessageSquareQuote size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No feedback available yet</h3>
            <p className="text-slate-500">Check back later for client testimonials.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                <MessageSquareQuote size={32} className="text-blue-100 mb-6 shrink-0" />
                <p className="text-slate-700 mb-8 flex-1 text-lg italic leading-relaxed">
                  "{testimonial.feedback}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  {testimonial.photo ? (
                    <img src={testimonial.photo} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                      {testimonial.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.client_name}</h4>
                    {testimonial.company && (
                      <p className="text-sm text-slate-500 font-medium">{testimonial.company}</p>
                    )}
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
