import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ToastProvider } from './components/admin/Toast';
import BrandSvgLoader from './components/ui/BrandSvgLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MouseGlow from './components/ui/MouseGlow';
import ScrollToTop from './components/ui/ScrollToTop';

// ─── Lazy load public pages ────────────────────────────────────────────────
const HomePage           = lazy(() => import('./pages/HomePage'));
const AboutPage          = lazy(() => import('./pages/AboutPage'));
const ServicesPage       = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage       = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage  = lazy(() => import('./pages/ProjectDetailPage'));
const ExperiencePage     = lazy(() => import('./pages/ExperiencePage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const TestimonialsPage   = lazy(() => import('./pages/TestimonialsPage'));
const ContactPage        = lazy(() => import('./pages/ContactPage'));
const ResumePage         = lazy(() => import('./pages/ResumePage'));

// ─── Lazy load admin pages ──────────────────────────────────────────────────
const AdminLogin         = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminHero          = lazy(() => import('./pages/admin/AdminHero'));
const AdminAbout         = lazy(() => import('./pages/admin/AdminAbout'));
const AdminServices      = lazy(() => import('./pages/admin/AdminServices'));
const AdminTechnologies  = lazy(() => import('./pages/admin/AdminTechnologies'));
const AdminProjects      = lazy(() => import('./pages/admin/AdminProjects'));
const AdminProjectEditor = lazy(() => import('./pages/admin/AdminProjectEditor'));
const AdminExperience    = lazy(() => import('./pages/admin/AdminExperience'));
const AdminCertifications= lazy(() => import('./pages/admin/AdminCertifications'));
const AdminTestimonials  = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminContact       = lazy(() => import('./pages/admin/AdminContact'));
const AdminCV            = lazy(() => import('./pages/admin/AdminCV'));
const AdminSettings      = lazy(() => import('./pages/admin/AdminSettings'));
const AdminMedia         = lazy(() => import('./pages/admin/AdminMedia'));
const AdminMessages      = lazy(() => import('./pages/admin/AdminMessages'));

// ─── Lazy load admin shell components ──────────────────────────────────────
const AdminLayout   = lazy(() => import('./components/admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));

// ─── Public portfolio layout ────────────────────────────────────────────────
const PublicRoutes = () => {
  const location = useLocation();
  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#6C63FF]/30 selection:text-[#6C63FF]">
      <ScrollToTop />
      <MouseGlow />
      <Navbar />
      <AnimatePresence mode="wait">
        <ErrorBoundary>
          <Suspense fallback={<BrandSvgLoader statusText="LOADING MODULE..." />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/"               element={<HomePage />} />
              <Route path="/about"          element={<AboutPage />} />
              <Route path="/services"       element={<ServicesPage />} />
              <Route path="/projects"       element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/experience"     element={<ExperiencePage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/testimonials"   element={<TestimonialsPage />} />
              <Route path="/contact"        element={<ContactPage />} />
              <Route path="/resume"         element={<ResumePage />} />
              <Route path="*"              element={<HomePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

// ─── Root App ────────────────────────────────────────────────────────────────
export const App = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <Router>
          <AdminAuthProvider>
            <ToastProvider>
              <Suspense fallback={<BrandSvgLoader statusText="LOADING..." />}>
                <Routes>
                  {/* ── Admin login (public, no layout) ── */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* ── Protected admin area ── */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <AdminLayout>
                          <Routes>
                            <Route path="dashboard"          element={<AdminDashboard />} />
                            <Route path="hero"               element={<AdminHero />} />
                            <Route path="about"              element={<AdminAbout />} />
                            <Route path="services"           element={<AdminServices />} />
                            <Route path="technologies"       element={<AdminTechnologies />} />
                            <Route path="projects"           element={<AdminProjects />} />
                            <Route path="projects/new"       element={<AdminProjectEditor />} />
                            <Route path="projects/:id/edit"  element={<AdminProjectEditor />} />
                            <Route path="experience"         element={<AdminExperience />} />
                            <Route path="certifications"     element={<AdminCertifications />} />
                            <Route path="testimonials"       element={<AdminTestimonials />} />
                            <Route path="contact"            element={<AdminContact />} />
                            <Route path="cv"                 element={<AdminCV />} />
                            <Route path="media"              element={<AdminMedia />} />
                            <Route path="settings"           element={<AdminSettings />} />
                            <Route path="messages"           element={<AdminMessages />} />
                            {/* Default admin redirect */}
                            <Route path="*"                  element={<AdminDashboard />} />
                          </Routes>
                        </AdminLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Public portfolio ── */}
                  <Route path="/*" element={<PublicRoutes />} />
                </Routes>
              </Suspense>
            </ToastProvider>
          </AdminAuthProvider>
        </Router>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
