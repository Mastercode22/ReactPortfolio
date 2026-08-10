import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { Award, Code, Coffee, Briefcase, CheckCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getAbout } from '../../services/aboutService';

const ICON_MAP = {
  Briefcase: Briefcase,
  Award: Award,
  Code: Code,
  Sparkles: Sparkles,
  Coffee: Coffee,
};

export const About = () => {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then((res) => {
        if (res) setData(res);
      })
      .catch((err) => console.error('Failed to fetch about data:', err))
      .finally(() => setLoading(false));
  }, []);

  const about = data?.about || {};
  const stats = data?.stats || [
    { label: 'Projects Completed', value: '45+', icon_name: 'Briefcase', color_class: 'text-[#6C63FF]' },
    { label: 'Years Experience', value: '6+', icon_name: 'Award', color_class: 'text-[#7C5CFF]' },
    { label: 'Technologies Mastered', value: '18+', icon_name: 'Code', color_class: 'text-[#5FA8FF]' },
    { label: 'Coffee & Passion', value: '2.4k', icon_name: 'Sparkles', color_class: 'text-amber-500' },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeader
          badge={about.badge || "About the Architect"}
          title={about.heading || "Crafting Digital Artistry with Algorithmic Precision"}
          subtitle={about.subheading || "Combining high-end design sensibilities from Apple, Linear, and Vercel with complex React frontend engineering."}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">

          {/* Profile Card & Avatar */}
          <div className="lg:col-span-5">
            <GlassCard neumorphic hoverEffect={false} className="relative overflow-hidden text-center">
              <div className="relative mx-auto w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden mb-6 border-4 border-white/20 shadow-2xl">
                <img
                  src={about.profile_image || "/images/logo.png"}
                  alt={about.name || "Emmanuel Quarshie"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => { e.target.src = "/images/logo.png"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold px-3 py-1.5 rounded-xl glass-card-dark flex items-center justify-between">
                  <span>{about.location || "Greater Accra, Ghana"}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                {about.name || "Emmanuel Quarshie"}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider gradient-text mt-1">
                {about.job_title || "Principal Digital Architect"}
              </p>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-[#667085] dark:text-[#CBD5E1]">
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {about.engineering_badge_1 || "React 19 & Tailwind CSS"}</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {about.engineering_badge_2 || "PHP 8.3 & MySQL Architecture"}</span>
              </div>
            </GlassCard>
          </div>

          {/* Bio & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard neumorphic hoverEffect={false} className="space-y-4">
              <h4 className="text-2xl font-bold text-[#1B2430] dark:text-[#F8FAFC]">
                {about.heading || "Engineering Digital Perfection Through Code & Design"}
              </h4>
              <p className="text-sm sm:text-base text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                {about.bio_paragraph_1 || "Specializing in high-performance React 19 SPAs, Neumorphic/Glassmorphic design systems, and micro-frontend client engineering."}
              </p>
              <p className="text-sm sm:text-base text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                {about.bio_paragraph_2 || "Covered structured systems analysis & design (SSAD), programming methods, HTML5, Core Java, C++, MS SQL Server, C#, VB.NET, Python, and rapid application development with PHP/MySQL."}
              </p>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, idx) => {
                const IconComponent = ICON_MAP[stat.icon_name] || Code;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GlassCard neumorphic hoverEffect={false} className="p-4 sm:p-6 text-center">
                      <IconComponent className={`w-6 h-6 mx-auto mb-2 ${stat.color_class || 'text-[#7C5CFF]'}`} />
                      <h5 className="text-2xl sm:text-3xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                        {stat.value}
                      </h5>
                      <p className="text-xs font-semibold text-[#667085] dark:text-[#CBD5E1] mt-1">
                        {stat.label}
                      </p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
