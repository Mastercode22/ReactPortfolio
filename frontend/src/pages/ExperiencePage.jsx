import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Experience from '../components/sections/Experience';
import Process from '../components/sections/Process';

export const ExperiencePage = () => {
  return (
    <PageWrapper>
      <Experience />
      <Process />
    </PageWrapper>
  );
};

export default ExperiencePage;
