import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import Contact from '../components/sections/Contact';

export const ServicesPage = () => {
  return (
    <PageWrapper>
      <Services />
      <Process />
      <Contact />
    </PageWrapper>
  );
};

export default ServicesPage;
