import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, CheckCircle2, Cpu, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NeumorphicButton from './NeumorphicButton';
import { useTheme } from '../../context/ThemeContext';

export const ProjectModal = ({ project, onClose }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll without layout shift
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  if (!project) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {/* Backdrop — renders directly on document.body, above everything */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
        className="bg-slate-950/85 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Scroll wrapper — click outside closes */}
      <div
        key="modal-wrapper"
        onClick={handleBackdropClick}
        style={{ position: 'fixed', inset: 0, zIndex: 99999, overflowY: 'auto' }}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} — Project Overview`}
      >
        <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>

          {/* Modal card */}
          <motion.div
            ref={modalRef}
            key="modal-card"
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full rounded-3xl shadow-2xl ${
              isDark
                ? 'bg-[#0F1629] border border-white/10'
                : 'bg-white border border-black/10'
            }`}
            style={{ maxWidth: '760px' }}
          >
            {/* ── Sticky Header ────────────────────────────────────── */}
            <div
              className={`sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-6 pb-4 rounded-t-3xl ${
                isDark ? 'bg-[#0F1629]' : 'bg-white'
              }`}
            >
              <div className="flex-1 min-w-0">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF] bg-[#6C63FF]/10 mb-2">
                  {project.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] leading-snug truncate">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="mt-1 text-sm text-[#667085] dark:text-[#CBD5E1] line-clamp-1">{project.subtitle}</p>
                )}
              </div>

              {/* ✕ Close */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="shrink-0 mt-1 p-2.5 rounded-full bg-white/10 hover:bg-[#6C63FF]/20 text-[#667085] dark:text-[#CBD5E1] hover:text-[#6C63FF] transition-all duration-200 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Body ─────────────────────────────────────────────── */}
            <div className="px-6 pb-6 space-y-5">

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-white/10">
                <img
                  src={project.image || project.cover_image || '/images/ecom.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/ecom.jpg'; }}
                />
              </div>

              {/* Performance Stats */}
              {project.performanceStats?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.performanceStats.map((stat, idx) => (
                    <div key={idx} className={`p-3 rounded-2xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <p className="text-[10px] font-semibold text-[#667085] dark:text-[#CBD5E1] mb-1">{stat.label}</p>
                      <p className="text-base font-extrabold text-[#6C63FF] dark:text-[#7C5CFF]">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Overview */}
              {project.description && (
                <div>
                  <h4 className="text-sm font-bold text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-[#6C63FF]" /> Overview
                  </h4>
                  <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Key Features */}
              {project.features?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#667085] dark:text-[#CBD5E1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenge & Solution */}
              {(project.challenges || project.solutions) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.challenges && (
                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-2">Challenge</h5>
                      <p className="text-xs text-[#667085] dark:text-[#CBD5E1] leading-relaxed">{project.challenges}</p>
                    </div>
                  )}
                  {project.solutions && (
                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2">Solution</h5>
                      <p className="text-xs text-[#667085] dark:text-[#CBD5E1] leading-relaxed">{project.solutions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tech Badges */}
              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#6C63FF]/10 text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <NeumorphicButton
                    variant="primary"
                    onClick={() => window.open(project.liveDemo || project.live_demo, '_blank')}
                    icon={ExternalLink}
                    title="Open the live deployed version"
                  >
                    View Live
                  </NeumorphicButton>
                  <NeumorphicButton
                    variant="secondary"
                    onClick={() => window.open(project.github || project.github_url, '_blank')}
                    icon={Github}
                    title="Browse source code on GitHub"
                  >
                    GitHub Repo
                  </NeumorphicButton>
                </div>
                <NeumorphicButton
                  variant="glass"
                  icon={BookOpen}
                  title="Read the full case study"
                  onClick={() => { onClose(); navigate(`/projects/${project.id}`); }}
                >
                  Case Study
                </NeumorphicButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );

  // Portal — renders directly into document.body, escaping ALL stacking contexts
  return createPortal(modalContent, document.body);
};

export default ProjectModal;
