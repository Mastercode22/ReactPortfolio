import React, { Suspense, lazy } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Hero from '../components/sections/Hero';

// Progressive Lazy Loading for below-the-fold sections
const About = lazy(() => import('../components/sections/About'));
const Services = lazy(() => import('../components/sections/Services'));
const TechStack = lazy(() => import('../components/sections/TechStack'));
const FeaturedProjects = lazy(() => import('../components/sections/FeaturedProjects'));
const Process = lazy(() => import('../components/sections/Process'));
const GithubSection = lazy(() => import('../components/sections/GithubSection'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));
const Contact = lazy(() => import('../components/sections/Contact'));

// Section Skeleton Fallback
const SectionSkeleton = () => (
  <div className="w-full py-16 flex items-center justify-center opacity-30">
    <div className="w-12 h-12 rounded-full border-2 border-[#6C63FF] border-t-transparent animate-spin" />
  </div>
);

export const HomePage = () => {
  return (
    <PageWrapper>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <About />
        <Services />
        <TechStack />
        <FeaturedProjects limit={3} showHeader={true} />
        <Process />
        <GithubSection />
        <Testimonials />
        <Contact />
      </Suspense>
    </PageWrapper>
  );
};

export default HomePage;

