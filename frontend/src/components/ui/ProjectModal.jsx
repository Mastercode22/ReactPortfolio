import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, CheckCircle2, Cpu, BarChart2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NeumorphicButton from './NeumorphicButton';
import { useTheme } from '../../context/ThemeContext';

export const ProjectModal = ({ project, onClose }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 z-10 shadow-2xl ${
            isDark ? 'glass-card-dark border-white/10' : 'glass-card-light border-white/80'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-card-light dark:glass-card-dark text-[#667085] dark:text-[#CBD5E1] hover:text-[#6C63FF] transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF] bg-[#6C63FF]/10 mb-2">
              {project.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
              {project.title}
            </h3>
            <p className="mt-2 text-[#667085] dark:text-[#CBD5E1] text-sm sm:text-base">
              {project.subtitle}
            </p>
          </div>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-slate-900 border border-white/10">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {project.performanceStats?.map((stat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl text-center ${
                  isDark ? 'neu-pressed-dark' : 'neu-pressed-light'
                }`}
              >
                <p className="text-xs font-medium text-[#667085] dark:text-[#CBD5E1]">{stat.label}</p>
                <p className="text-lg sm:text-xl font-extrabold gradient-text mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Description & Features */}
          <div className="space-y-6 mb-8 text-[#1B2430] dark:text-[#F8FAFC]">
            <div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#6C63FF] dark:text-[#7C5CFF]" /> Overview & Architecture
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-[#667085] dark:text-[#CBD5E1]">
                {project.description}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Key Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {project.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#667085] dark:text-[#CBD5E1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] dark:bg-[#7C5CFF] mt-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <h5 className="font-bold text-xs uppercase tracking-wider text-rose-500 mb-1">Challenge</h5>
                <p className="text-xs sm:text-sm text-[#667085] dark:text-[#CBD5E1]">{project.challenges}</p>
              </div>
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-500 mb-1">Solution</h5>
                <p className="text-xs sm:text-sm text-[#667085] dark:text-[#CBD5E1]">{project.solutions}</p>
              </div>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold glass-card-light dark:glass-card-dark text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <NeumorphicButton
                variant="primary"
                onClick={() => window.open(project.liveDemo, '_blank')}
                icon={ExternalLink}
              >
                Live Demo
              </NeumorphicButton>
              <NeumorphicButton
                variant="secondary"
                onClick={() => window.open(project.github, '_blank')}
                icon={Github}
              >
                GitHub
              </NeumorphicButton>
            </div>
            
            <NeumorphicButton
              variant="glass"
              onClick={() => {
                onClose();
                navigate(`/projects/${project.id}`);
              }}
            >
              Full Case Study Page →
            </NeumorphicButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
