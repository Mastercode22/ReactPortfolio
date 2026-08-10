import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import { Download, Printer, Mail, MapPin, Globe, Award } from 'lucide-react';
import { getAbout } from '../services/aboutService';
import { getExperience } from '../services/experienceService';
import { getCertifications } from '../services/certificationsService';
import { getTechnologies } from '../services/technologiesService';
import { getContact } from '../services/contactService';
import { getSocialLinks } from '../services/socialService';
import { downloadCv } from '../services/cvService';

export const ResumePage = () => {
  const [about, setAbout] = useState(null);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [contact, setContact] = useState(null);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    getAbout().then(res => res?.about && setAbout(res.about)).catch(err => console.error(err));
    getExperience().then(res => Array.isArray(res) && setExperience(res)).catch(err => console.error(err));
    getCertifications().then(res => Array.isArray(res) && setCertifications(res)).catch(err => console.error(err));
    getTechnologies().then(res => Array.isArray(res) && setTechnologies(res)).catch(err => console.error(err));
    getContact().then(res => res && setContact(res)).catch(err => console.error(err));
    getSocialLinks().then(res => Array.isArray(res) && setSocials(res)).catch(err => console.error(err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const name = about?.name || "EMMANUEL QUARSHIE";
  const webTitle = about?.job_title || "Principal Digital Architect & Design Engineer";
  const printTitle = "Software Developer | Frontend Developer";
  const email = contact?.email || "quarshie395@gmail.com";
  const location = contact?.location || about?.location || "Greater Accra, Ghana / Remote Worldwide";
  const portfolioUrl = "emmanuelquarshief.netlify.app";
  const githubUrl = "github.com/quarshie395";
  const linkedinUrl = "linkedin.com/in/quarshie395";

  // Build categorized technologies list from CMS/DB
  const techNames = technologies.map(t => t.name || t);

  const frontendTechs = [
    'React 19', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion', 'GSAP'
  ].filter(t => techNames.length === 0 || techNames.some(tn => tn.toLowerCase().includes(t.toLowerCase().split(' ')[0])));

  const backendTechs = [
    'PHP 8.3', 'REST API', 'MySQL'
  ].filter(t => techNames.length === 0 || techNames.some(tn => tn.toLowerCase().includes(t.toLowerCase().split(' ')[0])));

  const programmingTechs = [
    'Python', 'C++', 'C#', 'VB.NET', 'Core Java'
  ];

  const toolsTechs = [
    'Git', 'Node.js', 'Vite', 'SSAD', 'Postman'
  ].filter(t => techNames.length === 0 || techNames.some(tn => tn.toLowerCase().includes(t.toLowerCase().split(' ')[0])));

  const allExperience = experience.length > 0 ? experience : [
    {
      id: 1,
      role: 'Freelance Software Developer & Systems Architect',
      company: 'Self-Employed / Agency Consulting',
      period: '2025 — Present',
      location: 'Remote Worldwide / Ghana',
      description: 'Designing and delivering bespoke web applications, enterprise dashboards, and custom CMS platforms for international clients.',
      achievements: [
        'Engineered high-performance React 19 SPAs integrated with custom PHP/MySQL backend APIs.',
        'Developed reusable Neumorphic & Glassmorphic UI component libraries reducing frontend build time by 40%.',
        'Achieved 99+ Lighthouse performance ratings across client web applications.'
      ]
    },
    {
      id: 2,
      role: 'Professional Diploma Software Engineering Student',
      company: 'IPMC Technology Center',
      period: 'Jan 2024 — Jan 2025',
      location: 'Accra, Ghana',
      description: 'Completed intensive hands-on software engineering coursework covering SSAD, Java, C++, Python, PHP/MySQL, and MS SQL Server with Grade A distinctions.',
      achievements: [
        'Graduated with Grade A in HTML5, SSAD, Programming Methods, C++, Intermediate Python, and PHP/MySQL.',
        'Built full-stack projects including inventory management systems and dynamic web portals.'
      ]
    }
  ];

  return (
    <PageWrapper>
      {/* ---------------------------------------------------- */}
      {/* WEB VIEW (Hidden when printing) */}
      {/* ---------------------------------------------------- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">

        <SectionHeader
          badge="Curriculum Vitae"
          title="Interactive Resume & Career Record"
          subtitle="A comprehensive overview of architectural accomplishments, engineering skills, and professional experience."
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
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
              onClick={() => downloadCv()}
              icon={Download}
              className="py-2.5 px-4 text-xs"
            >
              Download PDF CV
            </NeumorphicButton>
          </div>
        </div>

        {/* Resume Web Card */}
        <GlassCard neumorphic gradientBorder className="p-8 sm:p-12 space-y-8 bg-white dark:bg-[#171E2F]">

          {/* Header Info */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1B2430] dark:text-[#F8FAFC]">
                {name}
              </h1>
              <p className="text-sm font-bold uppercase tracking-wider gradient-text mt-1">
                {webTitle}
              </p>
              <p className="text-xs text-[#667085] dark:text-[#CBD5E1] max-w-lg mt-3 leading-relaxed">
                {about?.bio_paragraph_1 || "Frontend architect with 6+ years specializing in high-performance React 19 SPAs, Neumorphic/Glassmorphic design systems, and micro-frontend client engineering."}
              </p>
            </div>

            <div className="space-y-2 text-xs font-medium text-[#667085] dark:text-[#CBD5E1] shrink-0">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#6C63FF]" /> {email}</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#6C63FF]" /> {location}</div>
              <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-[#6C63FF]" /> {portfolioUrl}</div>
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
                'Core Web Vitals & Performance Optimization', 'Enterprise Security Architecture'
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
              {allExperience.map((exp) => {
                const achievements = Array.isArray(exp.achievements) ? exp.achievements : [];
                return (
                  <div key={exp.id || exp.role} className="space-y-2">
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

                    {achievements.length > 0 && (
                      <ul className="space-y-1 text-xs text-[#1B2430] dark:text-[#F8FAFC]">
                        {achievements.map((achieve, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-1.5 shrink-0" />
                            <span>{achieve}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6C63FF] dark:text-[#7C5CFF]">
                Education & Diplomas
              </h3>
              <div>
                <h4 className="font-bold text-sm text-[#1B2430] dark:text-[#F8FAFC]">Professional Diploma in Software Engineering</h4>
                <p className="text-xs text-[#667085] dark:text-[#CBD5E1]">IPMC Technology Center • Jan 2024 — Jan 2025</p>
                <p className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-1">Modules: SSAD, Core Java, C++, VB.NET, Python, HTML5, SQL Server, PHP/MySQL</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6C63FF] dark:text-[#7C5CFF]">
                Key Certifications
              </h3>
              <ul className="space-y-1 text-xs text-[#1B2430] dark:text-[#F8FAFC]">
                {certifications.slice(0, 3).map((cert) => (
                  <li key={cert.id} className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{cert.title} ({cert.issue_date || cert.date})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </GlassCard>

      </div>

      {/* ---------------------------------------------------- */}
      {/* DEDICATED PRINT CV DOCUMENT (Rendered ONLY on Print/PDF) */}
      {/* ---------------------------------------------------- */}
      <div className="hidden print:block cv-print-only text-slate-900 leading-snug space-y-3">
        
        {/* HEADER */}
        <div className="border-b border-slate-900 pb-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase mb-0.5">
            {name}
          </h1>
          <p className="text-[11px] font-bold text-[#6C63FF] uppercase tracking-wider mb-1.5">
            {printTitle}
          </p>
          <p className="text-[9pt] font-medium text-slate-700 flex flex-wrap items-center gap-1.5">
            <span>{email}</span>
            <span>•</span>
            <span>{location}</span>
            <span>•</span>
            <span>{portfolioUrl}</span>
            <span>•</span>
            <span>{githubUrl}</span>
            <span>•</span>
            <span>{linkedinUrl}</span>
          </p>
        </div>

        {/* PROFESSIONAL SUMMARY */}
        <div className="space-y-1 cv-avoid-break">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-[9.5pt] text-slate-800 leading-snug">
            {about?.bio_paragraph_1 || "Specializing in high-performance React 19 SPAs, Neumorphic/Glassmorphic design systems, and micro-frontend client engineering."}
          </p>
          {about?.bio_paragraph_2 && (
            <p className="text-[9.5pt] text-slate-800 leading-snug mt-1">
              {about.bio_paragraph_2}
            </p>
          )}
        </div>

        {/* CORE ARCHITECTURAL COMPETENCIES */}
        <div className="space-y-1 cv-avoid-break">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Core Architectural Competencies
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9pt] font-medium text-slate-800">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              React 19 & Next.js SPA/SSR
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              Neumorphism & Glassmorphism Design Tokens
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              Framer Motion & GSAP 60FPS Animations
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              TypeScript & Scalable State Management
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              PHP 8.3 REST Endpoints & MySQL Schema Design
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              Tailwind CSS Custom Plugin Architecture
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              Core Web Vitals & Performance Optimization
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-900"></span>
              Enterprise Security Architecture
            </li>
          </ul>
        </div>

        {/* PROFESSIONAL EXPERIENCE */}
        <div className="space-y-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 cv-avoid-break">
            Professional Experience
          </h2>

          <div className="space-y-2.5">
            {allExperience.map((exp) => {
              const achievements = Array.isArray(exp.achievements) ? exp.achievements : [];
              return (
                <div key={exp.id || exp.role} className="space-y-1 cv-avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[10.5pt] font-bold text-slate-950">
                      {exp.role}
                    </h3>
                    <span className="text-[9pt] font-bold text-slate-700">
                      {exp.period} | {exp.location}
                    </span>
                  </div>
                  <p className="text-[9.5pt] font-semibold text-[#6C63FF]">
                    {exp.company}
                  </p>
                  <p className="text-[9pt] text-slate-800 leading-snug">
                    {exp.description}
                  </p>
                  {achievements.length > 0 && (
                    <div className="pt-0.5">
                      <p className="text-[8.8pt] font-bold text-slate-900 mb-0.5">Key achievements:</p>
                      <ul className="space-y-0.5 pl-3">
                        {achievements.map((achieve, idx) => (
                          <li key={idx} className="text-[8.8pt] text-slate-800 list-disc leading-snug">
                            {achieve}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* EDUCATION & DIPLOMAS */}
        <div className="space-y-1 cv-avoid-break">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Education & Diplomas
          </h2>
          <div className="space-y-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[10pt] font-bold text-slate-950">
                Professional Diploma in Software Engineering
              </h3>
              <span className="text-[9pt] font-bold text-slate-700">Jan 2024 — Jan 2025</span>
            </div>
            <p className="text-[9pt] font-semibold text-[#6C63FF]">IPMC Technology Center</p>
            <p className="text-[8.8pt] text-slate-700">
              <span className="font-bold">Modules:</span> Structured Systems Analysis & Design (SSAD), Core Java, C++, VB.NET, Python, HTML5, MS SQL Server, PHP/MySQL
            </p>
          </div>
        </div>

        {/* KEY CERTIFICATIONS */}
        <div className="space-y-1 cv-avoid-break">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Key Certifications
          </h2>
          <ul className="space-y-0.5 text-[9pt]">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <li key={cert.id} className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{cert.title} — <span className="font-normal text-slate-700">{cert.issuer}</span></span>
                  <span className="text-slate-600 font-medium">{cert.issue_date || cert.date}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Professional Diploma in Software Engineering — <span className="font-normal text-slate-700">IPMC Technology Center</span></span>
                  <span className="text-slate-600 font-medium">Jan 2024 — Jan 2025</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Advanced Software Engineering — <span className="font-normal text-slate-700">IPMC Technology Center</span></span>
                  <span className="text-slate-600 font-medium">2025 — 2026 (In Progress)</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">WASSCE Certificate — <span className="font-normal text-slate-700">WAEC Ghana</span></span>
                  <span className="text-slate-600 font-medium">2019 — 2024</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* TECHNOLOGIES */}
        <div className="space-y-1 cv-avoid-break">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Technologies
          </h2>
          <div className="space-y-0.5 text-[9pt]">
            <div>
              <span className="font-bold text-slate-950">Frontend: </span>
              <span className="text-slate-800">
                {frontendTechs.join(' • ')}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-950">Backend: </span>
              <span className="text-slate-800">
                {backendTechs.join(' • ')}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-950">Programming: </span>
              <span className="text-slate-800">
                {programmingTechs.join(' • ')}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-950">Tools: </span>
              <span className="text-slate-800">
                {toolsTechs.join(' • ')}
              </span>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default ResumePage;
