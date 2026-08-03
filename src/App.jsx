import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MouseGlow from './components/ui/MouseGlow';
import ScrollToTop from './components/ui/ScrollToTop';
import { Loader2 } from 'lucide-react';

// Lazy loading pages with React.lazy
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));

// Premium Loading Indicator
const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F6F7FB] dark:bg-[#090B13] transition-colors">
    <div className="flex flex-col items-center gap-4">
      <div className="relative p-4 rounded-3xl neu-flat-light dark:neu-flat-dark">
        <Loader2 className="w-8 h-8 text-[#6C63FF] dark:text-[#7C5CFF] animate-spin" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#667085] dark:text-[#CBD5E1]">
        Hydrating Architecture...
      </span>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resume" element={<ResumePage />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#6C63FF]/30 selection:text-[#6C63FF]">
          <ScrollToTop />
          <MouseGlow />
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
