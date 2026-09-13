import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/src/components/layout/PublicLayout';
import AdminLayout from '@/src/components/layout/AdminLayout';
import Home from '@/src/pages/public/Home';
import About from '@/src/pages/public/About';
import Services from '@/src/pages/public/Services';
import Portfolio from '@/src/pages/public/Portfolio';
import CaseStudy from '@/src/pages/public/CaseStudy';
import Contact from '@/src/pages/public/Contact';
import ClientFeedback from '@/src/pages/public/ClientFeedback';
import AdminLogin from '@/src/pages/public/AdminLogin';
import AdminDashboard from '@/src/pages/admin/AdminDashboard';
import AdminLeads from '@/src/pages/admin/AdminLeads';
import AdminServices from '@/src/pages/admin/AdminServices';
import AdminPortfolio from '@/src/pages/admin/AdminPortfolio';
import AdminSettings from '@/src/pages/admin/AdminSettings';
import AdminTestimonials from '@/src/pages/admin/AdminTestimonials';
import AdminFaqs from '@/src/pages/admin/AdminFaqs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<CaseStudy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="feedback" element={<ClientFeedback />} />
        </Route>
        
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
