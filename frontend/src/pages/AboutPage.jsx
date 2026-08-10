import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import About from '../components/sections/About';
import TechStack from '../components/sections/TechStack';
import Process from '../components/sections/Process';

export const AboutPage = () => {
  return (
    <PageWrapper>
      <About />
      <TechStack />
      <Process />
    </PageWrapper>
  );
};

export default AboutPage;
