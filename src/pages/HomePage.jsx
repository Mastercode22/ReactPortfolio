import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import TechStack from '../components/sections/TechStack';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import Process from '../components/sections/Process';
import GithubSection from '../components/sections/GithubSection';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

export const HomePage = () => {
  return (
    <PageWrapper>
      <Hero />
      <About />
      <Services />
      <TechStack />
      <FeaturedProjects limit={3} showHeader={true} />
      <Process />
      <GithubSection />
      <Testimonials />
      <Contact />
    </PageWrapper>
  );
};

export default HomePage;
