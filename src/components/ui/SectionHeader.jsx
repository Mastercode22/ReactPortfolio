import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  center = true,
  className = ''
}) => {
  return (
    <div className={`mb-12 sm:mb-16 ${center ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 glass-card-light dark:glass-card-dark text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/20"
        >
          <span className="w-2 h-2 rounded-full bg-[#6C63FF] dark:bg-[#7C5CFF] animate-pulse" />
          {badge}
        </motion.div>
      )}

      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1B2430] dark:text-[#F8FAFC] leading-[1.2]"
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-[#667085] dark:text-[#CBD5E1] font-normal leading-[1.7]"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
