import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import {
  ArrowLeft, ExternalLink, Github, CheckCircle2,
  Cpu, Layers, Zap, AlertTriangle, Lightbulb,
  Calendar, Tag, BarChart2, ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getProjectBySlug, getProjects } from '../services/projectsService';

// ── Animated counter ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 dark:bg-white/[0.04] border border-white/10 text-center"
  >
    <span className="text-2xl sm:text-3xl font-black text-[#6C63FF] dark:text-[#7C5CFF] leading-none mb-1">
      {value}
    </span>
    <span className="text-[11px] font-semibold text-[#667085] dark:text-[#94A3B8] uppercase tracking-wider mt-1">
      {label}
    </span>
  </motion.div>
);

// ── Loading skeleton ──────────────────────────────────────────────────────────
const Skeleton = () => (
  <PageWrapper>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
      <div className="h-6 w-32 bg-white/10 rounded-full" />
      <div className="h-12 w-3/4 bg-white/10 rounded-2xl" />
      <div className="h-4 w-full bg-white/10 rounded-xl" />
      <div className="aspect-video w-full bg-white/10 rounded-3xl" />
    </div>
  </PageWrapper>
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, label, color = 'text-[#6C63FF]' }) => (
  <h2 className={`text-xl sm:text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-3 mb-6`}>
    <span className={`w-9 h-9 rounded-xl flex items-center justify-center bg-[#6C63FF]/10 ${color}`}>
      <Icon className="w-5 h-5" />
    </span>
    {label}
  </h2>
);

// ── Main component ────────────────────────────────────────────────────────────
export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProj = async () => {
      try {
        setLoading(true);
        const data = await getProjectBySlug(slug);
        const resolved = data || null;
        setProject(resolved);

        // Fetch related (same category, different id)
        const all = await getProjects();
        if (Array.isArray(all)) {
          setRelated(
            all
              .filter(p => p.id !== resolved?.id)
              .slice(0, 3)
          );
        }
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProj();
  }, [slug]);

  if (loading) return <Skeleton />;
  if (!project) return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-[#667085]">Project not found.</p>
        <NeumorphicButton variant="primary" onClick={() => navigate('/projects')} icon={ArrowLeft}>
          Back to Projects
        </NeumorphicButton>
      </div>
    </PageWrapper>
  );

  const projectImage = project.image || project.cover_image || '/images/ecom.jpg';
  const tags = Array.isArray(project.technologies) ? project.technologies
    : Array.isArray(project.tags) ? project.tags : [];
  const features = Array.isArray(project.features) ? project.features : [];
  const stats = Array.isArray(project.performanceStats) ? project.performanceStats : [];
  const liveUrl = project.live_demo || project.liveDemo;
  const githubUrl = project.github_url || project.github;

  const createdYear = project.created_at
    ? new Date(project.created_at).getFullYear()
    : null;

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Back Nav ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <NeumorphicButton variant="secondary" onClick={() => navigate('/projects')} icon={ArrowLeft}>
            All Projects
          </NeumorphicButton>
        </motion.div>

        {/* ── Hero Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 space-y-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF] bg-[#6C63FF]/10">
              {project.category}
            </span>
            {createdYear && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#667085] dark:text-[#94A3B8] bg-white/5 border border-white/10">
                <Calendar className="w-3 h-3" /> {createdYear}
              </span>
            )}
            {project.is_featured === 1 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20">
                ★ Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1B2430] dark:text-[#F8FAFC] tracking-tight leading-[1.1]">
            {project.title}
          </h1>
          <p className="text-lg text-[#667085] dark:text-[#CBD5E1] max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </motion.div>

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-10 aspect-[16/8] shadow-2xl bg-slate-900 border border-white/10 group"
        >
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = '/images/ecom.jpg'; }}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          {/* CTA overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Case Study</p>
              <p className="text-white font-black text-lg leading-tight">{project.title}</p>
            </div>
            <div className="flex gap-3">
              {liveUrl && (
                <button
                  onClick={() => window.open(liveUrl, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#7C5CFF] text-white text-xs font-bold transition-all shadow-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Live
                </button>
              )}
              {githubUrl && (
                <button
                  onClick={() => window.open(githubUrl, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Performance Stats ─────────────────────────────────────── */}
        {stats.length > 0 && (
          <div className={`grid gap-4 mb-12 ${stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {stats.map((stat, i) => (
              <StatCard key={i} index={i} label={stat.label} value={stat.value} />
            ))}
          </div>
        )}

        {/* ── Main Content + Sidebar ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

          {/* ── LEFT: Main Content ─────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Executive Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard neumorphic className="p-7 sm:p-8">
                <SectionTitle icon={Cpu} label="Executive Overview" />
                <p className="text-base text-[#667085] dark:text-[#CBD5E1] leading-[1.85]">
                  {project.description}
                </p>
              </GlassCard>
            </motion.div>

            {/* Key Features */}
            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard neumorphic className="p-7 sm:p-8">
                  <SectionTitle icon={CheckCircle2} label="Core Features & Capabilities" color="text-emerald-500" />
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] dark:bg-white/[0.02] border border-white/5">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-black shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-[#1B2430] dark:text-[#E2E8F0] leading-relaxed font-medium">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            )}

            {/* Challenge & Solution */}
            {(project.challenges || project.solutions) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {project.challenges && (
                  <GlassCard neumorphic className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                        The Challenge
                      </span>
                    </div>
                    <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                      {project.challenges}
                    </p>
                  </GlassCard>
                )}
                {project.solutions && (
                  <GlassCard neumorphic className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-emerald-500" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                        The Solution
                      </span>
                    </div>
                    <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                      {project.solutions}
                    </p>
                  </GlassCard>
                )}
              </motion.div>
            )}

            {/* Architecture */}
            {project.architecture && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <GlassCard neumorphic className="p-7 sm:p-8">
                  <SectionTitle icon={Layers} label="Technical Architecture" color="text-[#5FA8FF]" />
                  <div className="flex flex-wrap gap-3">
                    {project.architecture.split('+').map((part, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] dark:text-[#7C5CFF] text-sm font-bold border border-[#6C63FF]/20"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {part.trim()}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Tech Stack */}
            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <GlassCard neumorphic className="p-7 sm:p-8">
                  <SectionTitle icon={Tag} label="Technology Stack" color="text-[#F59E0B]" />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 dark:bg-white/[0.04] text-[#1B2430] dark:text-[#F8FAFC] border border-white/10 hover:border-[#6C63FF]/40 hover:text-[#6C63FF] dark:hover:text-[#7C5CFF] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: Sticky Sidebar ──────────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-5">

              {/* Project Info Card */}
              <GlassCard neumorphic className="p-6 space-y-5">
                <h4 className="font-extrabold text-base text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#6C63FF]" /> Project Info
                </h4>

                <div className="space-y-3 text-sm divide-y divide-white/5">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#667085] dark:text-[#94A3B8] font-medium">Category</span>
                    <span className="font-bold text-[#1B2430] dark:text-[#F8FAFC] text-right text-xs">{project.category}</span>
                  </div>
                  {project.architecture && (
                    <div className="flex justify-between items-start gap-4 py-2">
                      <span className="text-[#667085] dark:text-[#94A3B8] font-medium shrink-0">Stack</span>
                      <span className="font-bold text-[#1B2430] dark:text-[#F8FAFC] text-right text-xs leading-relaxed">{project.architecture}</span>
                    </div>
                  )}
                  {createdYear && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#667085] dark:text-[#94A3B8] font-medium">Year</span>
                      <span className="font-bold text-[#1B2430] dark:text-[#F8FAFC] text-xs">{createdYear}</span>
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="py-2">
                      <span className="text-[#667085] dark:text-[#94A3B8] font-medium text-xs block mb-2">Technologies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((t, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#6C63FF]/10 text-[#6C63FF] dark:text-[#7C5CFF]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-2">
                  {liveUrl && (
                    <NeumorphicButton
                      variant="primary"
                      onClick={() => window.open(liveUrl, '_blank')}
                      icon={ExternalLink}
                      className="w-full justify-center"
                    >
                      Launch Live Demo
                    </NeumorphicButton>
                  )}
                  {githubUrl && (
                    <NeumorphicButton
                      variant="secondary"
                      onClick={() => window.open(githubUrl, '_blank')}
                      icon={Github}
                      className="w-full justify-center"
                    >
                      View Source Code
                    </NeumorphicButton>
                  )}
                </div>
              </GlassCard>

              {/* Performance summary in sidebar too */}
              {stats.length > 0 && (
                <GlassCard neumorphic className="p-5 space-y-3">
                  <h4 className="font-extrabold text-sm text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Performance
                  </h4>
                  <div className="space-y-2">
                    {stats.map((s, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-xs text-[#667085] dark:text-[#94A3B8]">{s.label}</span>
                        <span className="text-xs font-black text-[#6C63FF] dark:text-[#7C5CFF]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>

        </div>

        {/* ── Related Projects ──────────────────────────────────────── */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border-t border-white/10 pt-16 mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                More Projects
              </h2>
              <NeumorphicButton variant="glass" onClick={() => navigate('/projects')} icon={ArrowRight}>
                View All
              </NeumorphicButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel, i) => {
                const relImage = rel.image || rel.cover_image || '/images/ecom.jpg';
                return (
                  <motion.div
                    key={rel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    onClick={() => navigate(`/projects/${rel.slug || rel.id}`)}
                    className="group cursor-pointer"
                  >
                    <GlassCard neumorphic className="overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relImage}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.target.src = '/images/ecom.jpg'; }}
                        />
                      </div>
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF]">
                          {rel.category}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#1B2430] dark:text-[#F8FAFC] group-hover:text-[#6C63FF] dark:group-hover:text-[#7C5CFF] transition-colors line-clamp-1">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-[#667085] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                          {rel.subtitle}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </PageWrapper>
  );
};

export default ProjectDetailPage;
