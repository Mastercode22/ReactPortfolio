import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import ProjectModal from '../ui/ProjectModal';
import { ExternalLink, Github, ArrowRight, Maximize2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getProjects } from '../../services/projectsService';

export const FeaturedProjects = ({ limit = 3, showHeader = true }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (Array.isArray(data)) setProjectsList(data);
      })
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  const projectsToDisplay = projectsList.slice(0, limit);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {showHeader && (
          <SectionHeader
            badge="Featured Works"
            title="Every Project is a Masterpiece of Architecture"
            subtitle="Explore high-impact digital applications engineered with Neumorphic perfection, sub-second response times, and Apple-grade precision."
          />
        )}

        <div className="space-y-16 sm:space-y-24">
          {projectsToDisplay.map((project, idx) => {
            const isEven = idx % 2 === 0;
            const projectImage = project.image || project.cover_image || '/images/ecom.jpg';
            const projectTags = Array.isArray(project.technologies) ? project.technologies : (Array.isArray(project.tags) ? project.tags : []);

            return (
              <GlassCard
                key={project.id}
                neumorphic
                gradientBorder
                hoverEffect={false}
                className="p-6 sm:p-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                  {/* Image / Mockup Side */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative rounded-3xl overflow-hidden group shadow-2xl border border-white/10 bg-slate-900">

                      <img
                        src={projectImage}
                        alt={project.title}
                        className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.target.src = '/images/ecom.jpg'; }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider glass-card-dark text-white border border-white/20">
                          {project.category}
                        </span>
                      </div>

                      {/* Hover Quick View Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <NeumorphicButton
                          variant="primary"
                          onClick={() => setSelectedProject(project)}
                          icon={Maximize2}
                        >
                          Quick View Details
                        </NeumorphicButton>
                      </div>

                    </div>
                  </div>

                  {/* Text & Content Side */}
                  <div className={`lg:col-span-5 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1B2430] dark:text-[#F8FAFC]">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                        {project.subtitle || project.description}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2">
                      {projectTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-full text-xs font-bold glass-card-light dark:glass-card-dark text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <NeumorphicButton
                        variant="primary"
                        onClick={() => navigate(`/projects/${project.slug || project.id}`)}
                        icon={ArrowRight}
                      >
                        View Case Study
                      </NeumorphicButton>

                      {project.live_demo || project.liveDemo ? (
                        <NeumorphicButton
                          variant="secondary"
                          onClick={() => window.open(project.live_demo || project.liveDemo, '_blank')}
                          icon={ExternalLink}
                        >
                          Live Demo
                        </NeumorphicButton>
                      ) : null}

                      {project.github_url || project.github ? (
                        <NeumorphicButton
                          variant="glass"
                          onClick={() => window.open(project.github_url || project.github, '_blank')}
                          icon={Github}
                        />
                      ) : null}
                    </div>

                  </div>

                </div>
              </GlassCard>
            );
          })}
        </div>

        {showHeader && (
          <div className="mt-16 text-center">
            <NeumorphicButton
              variant="secondary"
              onClick={() => navigate('/projects')}
              className="px-8 py-4 text-base"
            >
              Explore All Projects Architecture →
            </NeumorphicButton>
          </div>
        )}

      </div>

      {/* Modal View */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProjects;
