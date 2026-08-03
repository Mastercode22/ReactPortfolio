import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { Github, Star, GitFork, Code, GitCommit, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const pinnedRepos = [
  { name: 'luxoragift-storefront', desc: 'Bespoke luxury gifting e-commerce SPA engine with 3D product preview built with React 19.', stars: 342, forks: 89, lang: 'TypeScript', color: '#3178C6' },
  { name: 'neumorphism-react-tokens', desc: 'Lightweight Neumorphic & Glassmorphic UI design token system for React and Tailwind CSS.', stars: 620, forks: 145, lang: 'JavaScript', color: '#F7DF1E' },
  { name: 'retailrow-pos-core', desc: 'Omnichannel retail inventory synchronization system with WebSocket real-time event pipeline.', stars: 215, forks: 42, lang: 'PHP', color: '#777BB4' },
  { name: 'fast-virtualized-[#canvas]', desc: 'High-performance 60 FPS HTML5 Canvas ticker & financial charting engine for React.', stars: 490, forks: 110, lang: 'React', color: '#61DAFB' }
];

export const GithubSection = () => {
  const { isDark } = useTheme();

  // Generate simulated 52-week contribution grid (364 blocks)
  const weeks = 52;
  const daysPerWeek = 7;
  const grid = Array.from({ length: weeks * daysPerWeek }, (_, i) => {
    // Generate varied activity intensity 0 to 4
    const rand = Math.random();
    if (rand > 0.85) return 4;
    if (rand > 0.65) return 3;
    if (rand > 0.45) return 2;
    if (rand > 0.25) return 1;
    return 0;
  });

  const getIntensityColor = (val) => {
    if (val === 4) return 'bg-[#6C63FF] shadow-sm shadow-[#6C63FF]';
    if (val === 3) return 'bg-[#7C5CFF]/80';
    if (val === 2) return 'bg-[#8B7BFF]/50';
    if (val === 1) return 'bg-[#6C63FF]/20';
    return isDark ? 'bg-slate-800/40' : 'bg-slate-200/60';
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Open Source & Telemetry"
          title="GitHub Engineering Activity"
          subtitle="Continuous integration, active open source repositories, and daily code commits."
        />

        {/* GitHub Stats Header Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Contributions', val: '2,840+', icon: GitCommit },
            { label: 'Public Repositories', val: '48', icon: Code },
            { label: 'Stars Earned', val: '1,667', icon: Star },
            { label: 'Forks Generated', val: '386', icon: GitFork }
          ].map((s, idx) => (
            <GlassCard key={idx} neumorphic className="p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto text-[#6C63FF] dark:text-[#7C5CFF] mb-1" />
              <h4 className="text-xl sm:text-2xl font-black text-[#1B2430] dark:text-[#F8FAFC]">{s.val}</h4>
              <p className="text-[11px] font-bold text-[#667085] dark:text-[#CBD5E1] mt-0.5">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Simulated Contribution Graph Card */}
        <GlassCard neumorphic gradientBorder className="p-6 sm:p-8 mb-12 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1B2430] dark:text-[#F8FAFC]">
              <Github className="w-5 h-5 text-[#6C63FF]" />
              <span>2,840 commits in the last year</span>
            </div>
            <span className="text-xs text-[#667085] dark:text-[#CBD5E1]">Contribution Matrix</span>
          </div>

          {/* Grid canvas */}
          <div className="min-w-[700px] flex gap-1 justify-between">
            {Array.from({ length: weeks }).map((_, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {Array.from({ length: daysPerWeek }).map((_, dIdx) => {
                  const val = grid[wIdx * daysPerWeek + dIdx];
                  return (
                    <div
                      key={dIdx}
                      className={`w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 ${getIntensityColor(val)}`}
                      title={`${val * 3} commits`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 text-[11px] text-[#667085] dark:text-[#CBD5E1]">
            <span>Learn how we count contributions</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#6C63FF]/20" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#8B7BFF]/50" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#7C5CFF]/80" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#6C63FF]" />
              <span>More</span>
            </div>
          </div>
        </GlassCard>

        {/* Pinned Repos Grid */}
        <h4 className="text-xl font-bold text-[#1B2430] dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" /> Pinned Repositories
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pinnedRepos.map((repo, idx) => (
            <motion.div
              key={repo.name}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard neumorphic className="p-6 space-y-3 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <a
                      href={`https://github.com/emmanuelquarshie/${repo.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-extrabold text-base text-[#6C63FF] dark:text-[#7C5CFF] hover:underline flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" /> {repo.name}
                    </a>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-card-light dark:glass-card-dark text-[#667085] dark:text-[#CBD5E1]">
                      Public
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                    {repo.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[#667085] dark:text-[#CBD5E1] pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.color }} />
                    <span>{repo.lang}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {repo.forks}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GithubSection;
