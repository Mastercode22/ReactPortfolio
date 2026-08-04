import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import { Download, Printer, ExternalLink, Mail, Phone, MapPin, Globe, CheckCircle2, Award } from 'lucide-react';
import { experienceData } from '../data/experience';
import { skillsData } from '../data/skills';
import { certificationsData } from '../data/certifications';

export const ResumePage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Curriculum Vitae"
          title="Interactive Resume & Career Record"
          subtitle="A comprehensive overview of architectural accomplishments, engineering skills, and professional experience."
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#667085] dark:text-[#CBD5E1]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Updated Q3 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <NeumorphicButton
              variant="secondary"
              onClick={handlePrint}
              icon={Printer}
              className="py-2.5 px-4 text-xs"
            >
              Print Resume
            </NeumorphicButton>

            <NeumorphicButton
              variant="primary"
              onClick={() => window.open('/theo.pdf', '_blank')}
              icon={Download}
              className="py-2.5 px-4 text-xs"
            >
              Download PDF CV
            </NeumorphicButton>
          </div>
        </div>

        {/* Resume Paper Container */}
        <GlassCard neumorphic gradientBorder className="p-8 sm:p-12 space-y-8 bg-white dark:bg-[#171E2F]">
          
          {/* Header Info */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1B2430] dark:text-[#F8FAFC]">
                Rapid Render Quarshie
              </h1>
              <p className="text-sm font-bold uppercase tracking-wider gradient-text mt-1">
                Principal Digital Architect & Design Engineer
              </p>
              <p className="text-xs text-[#667085] dark:text-[#CBD5E1] max-w-lg mt-3 leading-relaxed">
                Frontend architect with 6+ years specializing in high-performance React 19 SPAs, Neumorphic/Glassmorphic design systems, and micro-frontend client engineering.
              </p>
            </div>

            <div className="space-y-2 text-xs font-medium text-[#667085] dark:text-[#CBD5E1] shrink-0">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#6C63FF]" /> Rapid Render.quarshie@example.com</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#6C63FF]" /> Anbert Garden, Ghana</div>
              <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-[#6C63FF]" /> Rapid Renderquarshie.dev</div>
            </div>
          </div>

          {/* Core Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#6C63FF] dark:text-[#7C5CFF]">
              Core Architectural Competencies
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {[
                'React 19 & Next.js SPA/SSR', 'Neumorphism & Glassmorphism Design Tokens',
                'Framer Motion & GSAP 60FPS Animations', 'TypeScript & Scalable State Management',
                'PHP 8.3 REST Endpoints & MySQL Schema Design', 'Tailwind CSS Custom Plugin Architecture',
                'Core Web Vitals & Performance Optimization', 'HIPAA & PCI-DSS Compliant Security Architecture'
              ].map((comp, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1B2430] dark:text-[#F8FAFC]">
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Experience History */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#6C63FF] dark:text-[#7C5CFF]">
              Professional Experience
            </h3>

            <div className="space-y-6">
              {experienceData.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h4 className="font-extrabold text-base text-[#1B2430] dark:text-[#F8FAFC]">
                        {exp.role} — <span className="text-[#6C63FF] dark:text-[#7C5CFF]">{exp.company}</span>
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#667085] dark:text-[#CBD5E1]">
                      {exp.period} | {exp.location}
                    </span>
                  </div>

                  <p className="text-xs text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-1 text-xs text-[#1B2430] dark:text-[#F8FAFC]">
                    {exp.achievements.map((achieve, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-1.5 shrink-0" />
                        <span>{achieve}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6C63FF] dark:text-[#7C5CFF]">
                Education
              </h3>
              <div>
                <h4 className="font-bold text-sm text-[#1B2430] dark:text-[#F8FAFC]">B.S. in Computer Science & Software Engineering</h4>
                <p className="text-xs text-[#667085] dark:text-[#CBD5E1]">University of California, Berkeley • Graduated 2019</p>
                <p className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-1">Honors: Magna Cum Laude (GPA 3.92/4.0)</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6C63FF] dark:text-[#7C5CFF]">
                Key Certifications
              </h3>
              <ul className="space-y-1 text-xs text-[#1B2430] dark:text-[#F8FAFC]">
                {certificationsData.slice(0, 3).map((cert) => (
                  <li key={cert.id} className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{cert.title} ({cert.date})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </GlassCard>

      </div>
    </PageWrapper>
  );
};

export default ResumePage;
