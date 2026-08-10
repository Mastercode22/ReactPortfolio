import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import ProjectModal from '../components/ui/ProjectModal';
import { ExternalLink, Github, ArrowRight, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getProjects } from '../services/projectsService';

const categories = ['All', 'E-Commerce & Digital Retail', 'SaaS & Enterprise Systems', 'Enterprise SaaS', 'Healthcare & Biotech', 'Fintech & Web3', 'Productivity & Collaboration'];

export const ProjectsPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModalProject, setSelectedModalProject] = useState(null);
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (Array.isArray(data)) setProjectsList(data);
      })
      .catch((err) => console.error('Failed to load projects:', err));
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? projectsList
    : projectsList.filter(p => p.category === selectedCategory);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Portfolio Archive"
          title="Digital Applications & Case Studies"
          subtitle="Explore the complete spectrum of custom web applications, e-commerce engines, and enterprise design systems."
        />

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? isDark
                    ? 'neu-pressed-dark text-[#7C5CFF] border border-[#7C5CFF]/40'
                    : 'neu-pressed-light text-[#6C63FF] border border-[#6C63FF]/40'
                  : isDark
                    ? 'glass-card-dark text-[#CBD5E1] hover:text-white'
                    : 'glass-card-light text-[#667085] hover:text-[#1B2430]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredProjects.map((project) => {
            const projectImage = project.image || project.cover_image || '/images/ecom.jpg';
            const tags = Array.isArray(project.technologies) ? project.technologies : (Array.isArray(project.tags) ? project.tags : []);

            return (
              <GlassCard key={project.id} neumorphic gradientBorder className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">

                <div className="space-y-4">
                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 group">
                    <img
                      src={projectImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = '/images/ecom.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <NeumorphicButton
                        variant="primary"
                        onClick={() => setSelectedModalProject(project)}
                        icon={Maximize2}
                      >
                        Quick View
                      </NeumorphicButton>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF]">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-black text-[#1B2430] dark:text-[#F8FAFC] mt-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                      {project.subtitle || project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-[#6C63FF] dark:text-[#7C5CFF]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <NeumorphicButton
                    variant="primary"
                    onClick={() => navigate(`/projects/${project.slug || project.id}`)}
                    icon={ArrowRight}
                    className="py-2 px-4 text-xs"
                  >
                    Case Study
                  </NeumorphicButton>

                  <div className="flex items-center gap-2">
                    {project.live_demo || project.liveDemo ? (
                      <NeumorphicButton
                        variant="glass"
                        onClick={() => window.open(project.live_demo || project.liveDemo, '_blank')}
                        icon={ExternalLink}
                        className="p-2.5"
                      />
                    ) : null}
                    {project.github_url || project.github ? (
                      <NeumorphicButton
                        variant="glass"
                        onClick={() => window.open(project.github_url || project.github, '_blank')}
                        icon={Github}
                        className="p-2.5"
                      />
                    ) : null}
                  </div>
                </div>

              </GlassCard>
            );
          })}
        </div>

      </div>

      {selectedModalProject && (
        <ProjectModal
          project={selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
        />
      )}
    </PageWrapper>
  );
};

export default ProjectsPage;
