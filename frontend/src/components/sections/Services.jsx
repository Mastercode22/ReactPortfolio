import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { Layout, Code, Globe, BarChart3, Figma, Zap, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getServices } from '../../services/servicesService';

const iconMap = {
  Layout,
  Code,
  Globe,
  BarChart3,
  Figma,
  Zap,
};

export const Services = () => {
  const { isDark } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch((err) => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeader
          badge="Bento Services Grid"
          title="Architectural Services Built for Luxury & Scale"
          subtitle="From high-frequency dashboard UI to bespoke e-commerce engines, every service is delivered with Neumorphic perfection."
        />

        <div className="grid grid-cols-12 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name] || iconMap[service.iconName] || Code;
            const sizeClass = service.grid_size || service.size || 'col-span-12 md:col-span-6';
            const features = Array.isArray(service.features) ? service.features : [];

            return (
              <div key={service.id} className={`${sizeClass} group`}>
                <GlassCard
                  neumorphic
                  gradientBorder
                  className="h-full flex flex-col justify-between p-6 sm:p-8"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Category */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3.5 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                          isDark ? 'neu-pressed-dark text-[#7C5CFF]' : 'neu-pressed-light text-[#6C63FF]'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#667085] dark:text-[#CBD5E1]">
                        {service.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] group-hover:text-[#6C63FF] dark:group-hover:text-[#7C5CFF] transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                      {service.description}
                    </p>

                    {/* Feature bullets */}
                    <ul className="space-y-2 pt-2 text-xs font-medium text-[#1B2430] dark:text-[#F8FAFC]">
                      {features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] dark:bg-[#7C5CFF]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Indicator */}
                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#6C63FF] dark:text-[#7C5CFF]">
                    <span>Learn More</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;
