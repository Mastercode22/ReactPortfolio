import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { Search, Compass, Palette, Code2, TestTube, Rocket, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const steps = [
  { step: '01', title: 'Discovery', icon: Search, desc: 'Deep dive into product requirements, user personas, brand aesthetics, and technical constraints.' },
  { step: '02', title: 'Planning', icon: Compass, desc: 'Architecting system schemas, component taxonomies, API contracts, and performance budgets.' },
  { step: '03', title: 'UI Design', icon: Palette, desc: 'Crafting Neumorphism & Glassmorphism design tokens, micro-interaction states, and dark mode palettes.' },
  { step: '04', title: 'Development', icon: Code2, desc: 'Engineering modular React 19 SPAs with sub-second lazy loading and 60 FPS motion sequences.' },
  { step: '05', title: 'Testing', icon: TestTube, desc: 'Rigorous end-to-end testing, Core Web Vitals audits, cross-browser validation, and security scans.' },
  { step: '06', title: 'Deployment', icon: Rocket, desc: 'Continuous integration deployment to Cloudflare Edge / Vercel with automated cache invalidation.' }
];

export const Process = () => {
  const { isDark } = useTheme();

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Execution Blueprint"
          title="The 6-Step Precision Development Process"
          subtitle="How I transform concepts into production-grade digital products with zero friction."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard neumorphic gradientBorder className="p-6 space-y-4 h-full relative group">
                
                {/* Top Row: Step Number & Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black gradient-text">
                    {item.step}
                  </span>
                  <div
                    className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                      isDark ? 'neu-pressed-dark text-[#7C5CFF]' : 'neu-pressed-light text-[#6C63FF]'
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                  {item.title}
                </h3>

                <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                  {item.desc}
                </p>

                {/* Connecting Indicator */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#6C63FF] opacity-30">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}

              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;
