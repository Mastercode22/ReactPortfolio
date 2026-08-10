import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import { projectsData } from '../data/projects';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Cpu, BarChart2, ShieldCheck, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const project = projectsData.find((p) => p.id === id) || projectsData[0];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <NeumorphicButton
            variant="secondary"
            onClick={() => navigate('/projects')}
            icon={ArrowLeft}
            className="py-2.5 px-4 text-xs"
          >
            Back to All Projects
          </NeumorphicButton>
        </div>

        {/* Case Study Header */}
        <div className="mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF] bg-[#6C63FF]/10">
            {project.category} — Case Study
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black text-[#1B2430] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            {project.title}
          </h1>

          <p className="text-lg text-[#667085] dark:text-[#CBD5E1] max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-bold glass-card-light dark:glass-card-dark text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Banner Screenshot */}
        <div className="relative rounded-3xl overflow-hidden mb-12 aspect-[16/9] shadow-2xl bg-slate-900 border border-white/10">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Performance Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {(project.performanceStats ?? []).map((stat, idx) => (
            <GlassCard key={idx} neumorphic className="p-6 text-center">
              <p className="text-xs font-semibold text-[#667085] dark:text-[#CBD5E1]">{stat.label}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold gradient-text mt-1">{stat.value}</h3>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <GlassCard neumorphic className="p-8 space-y-4">
              <h3 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2">
                <Cpu className="w-6 h-6 text-[#6C63FF]" /> Executive Overview
              </h3>
              <p className="text-base text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                {project.description}
              </p>
            </GlassCard>

            {/* Features */}
            <GlassCard neumorphic className="p-8 space-y-4">
              <h3 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Core Engineering Features
              </h3>
              <ul className="space-y-3">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#1B2430] dark:text-[#F8FAFC]">
                    <span className="w-2 h-2 rounded-full bg-[#6C63FF] mt-2 shrink-0" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Challenges & Solutions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlassCard neumorphic className="p-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Engineering Challenge</span>
                <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                  {project.challenges}
                </p>
              </GlassCard>

              <GlassCard neumorphic className="p-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Implemented Solution</span>
                <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                  {project.solutions}
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard neumorphic className="p-6 space-y-6 sticky top-28">
              <h4 className="font-extrabold text-lg text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#6C63FF]" /> Architecture Specs
              </h4>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-[#667085] dark:text-[#CBD5E1] uppercase">Stack Architecture</span>
                  <p className="font-bold text-[#1B2430] dark:text-[#F8FAFC] mt-1">{project.architecture}</p>
                </div>
                <div>
                  <span className="font-bold text-[#667085] dark:text-[#CBD5E1] uppercase">Primary Category</span>
                  <p className="font-bold text-[#1B2430] dark:text-[#F8FAFC] mt-1">{project.category}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <NeumorphicButton
                  variant="primary"
                  onClick={() => window.open(project.liveDemo, '_blank')}
                  icon={ExternalLink}
                  className="w-full py-3"
                >
                  Launch Live Demo
                </NeumorphicButton>

                <NeumorphicButton
                  variant="secondary"
                  onClick={() => window.open(project.github, '_blank')}
                  icon={Github}
                  className="w-full py-3"
                >
                  View GitHub Source
                </NeumorphicButton>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default ProjectDetailPage;
