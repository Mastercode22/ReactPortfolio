import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { skillsData } from '../../data/skills';
import { FaReact, FaPhp, FaGitAlt, FaNodeJs } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiMysql, SiTypescript, SiGsap } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';
import { MdAnimation } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const iconComponentMap = {
  FaReact,
  SiJavascript,
  SiTailwindcss,
  FaPhp,
  SiMysql,
  FaGitAlt,
  FaNodeJs,
  TbApi,
  SiTypescript,
  MdAnimation,
  SiGsap,
};

export const TechStack = () => {
  const { isDark } = useTheme();

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Engineering Arsenal"
          title="Battle-Tested Tech Stack & Toolkit"
          subtitle="Mastering modern frontend ecosystems, backend data pipelines, and animation frameworks."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {skillsData.map((skill, idx) => {
            const IconComp = iconComponentMap[skill.icon] || FaReact;

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative"
              >
                <GlassCard
                  neumorphic
                  gradientBorder
                  className="p-5 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer"
                >
                  {/* Icon Container with rotate & scale effect */}
                  <div
                    className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-115 group-hover:rotate-6 ${
                      isDark ? 'neu-pressed-dark' : 'neu-pressed-light'
                    }`}
                    style={{ color: skill.color }}
                  >
                    <IconComp className="w-7 h-7 drop-shadow-md" />
                  </div>

                  {/* Skill Name */}
                  <h4 className="font-extrabold text-sm text-[#1B2430] dark:text-[#F8FAFC]">
                    {skill.name}
                  </h4>

                  {/* Skill Category */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#CBD5E1]">
                    {skill.category}
                  </span>

                  {/* Skill Level Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#5FA8FF] transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </GlassCard>

                {/* Tooltip on Hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl glass-card-dark text-[11px] font-semibold text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 whitespace-nowrap shadow-xl border border-white/20">
                  {skill.description}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TechStack;
