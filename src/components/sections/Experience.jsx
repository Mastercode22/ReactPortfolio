import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { experienceData } from '../../data/experience';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Experience = () => {
  const { isDark } = useTheme();

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Career Journey"
          title="Professional Experience & Key Milestones"
          subtitle="A track record of engineering leadership, system architecture, and UI innovation across digital agencies and enterprise products."
        />

        <div className="relative max-w-4xl mx-auto">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-[#6C63FF] via-[#7C5CFF] to-[#5FA8FF] opacity-40 rounded-full" />

          <div className="space-y-12 sm:space-y-16">
            {experienceData.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col sm:flex-row items-center"
                >
                  {/* Timeline Glowing Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full p-1 glass-card-light dark:glass-card-dark shadow-xl flex items-center justify-center border border-[#6C63FF]/50">
                    <span className="w-3 h-3 rounded-full bg-[#6C63FF] dark:bg-[#7C5CFF] animate-pulse" />
                  </div>

                  {/* Card content aligned left or right */}
                  <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:ml-auto sm:pl-12'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <GlassCard neumorphic gradientBorder className="p-6 space-y-4">
                        {/* Role & Company Header */}
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#6C63FF] dark:text-[#7C5CFF] bg-[#6C63FF]/10 mb-2">
                            {item.period}
                          </span>
                          <h3 className="text-xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                            {item.role}
                          </h3>
                          <div className={`flex items-center gap-3 text-xs font-bold text-[#667085] dark:text-[#CBD5E1] mt-1 ${isEven ? 'sm:justify-end' : ''}`}>
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {item.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                          {item.description}
                        </p>

                        {/* Key Achievements */}
                        <ul className="space-y-1.5 text-xs text-[#1B2430] dark:text-[#F8FAFC] text-left">
                          {item.achievements.map((achieve, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{achieve}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Skills Badges */}
                        <div className={`flex flex-wrap gap-1.5 pt-2 ${isEven ? 'sm:justify-end' : ''}`}>
                          {item.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-white/10 text-[#6C63FF] dark:text-[#7C5CFF] border border-white/10"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Experience;
