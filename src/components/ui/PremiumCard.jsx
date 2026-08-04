import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const PremiumCard = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  animateIn = false,
  delay = 0,
  padding,
  ...props
}) => {
  const { isDark } = useTheme();

  // If padding prop is not passed and className doesn't specify padding, fallback to default generous padding
  const paddingClass = padding !== undefined ? padding : (/\bp-[0-9]/).test(className) ? '' : 'p-6 sm:p-8';

  const motionProps = animateIn
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.35, ease: 'easeOut', delay },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      whileHover={hoverEffect ? { y: -6 } : {}}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
      onClick={onClick}
      className={`group relative rounded-[24px] overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-[#121620] text-[#F8FAFC] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-[#161B28] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]'
          : 'bg-[#FAFAFC] text-[#1B2430] shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:bg-[#FFFFFF] hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ borderRadius: '24px' }}
      {...props}
    >
      {/* Illuminated Left Edge Accent (Embedded LED Strip) */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3.5px] rounded-r-full pointer-events-none transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#FFD76A] via-[#F4B942] to-[#E39B18] shadow-[0_0_12px_rgba(244,185,66,0.6),0_0_20px_rgba(255,215,106,0.3)] group-hover:shadow-[0_0_18px_rgba(244,185,66,0.9),0_0_30px_rgba(255,215,106,0.6)] group-hover:w-[4.5px]'
            : 'bg-gradient-to-b from-[#60A5FA] via-[#3B82F6] to-[#2563EB] shadow-[0_0_12px_rgba(59,130,246,0.5),0_0_20px_rgba(96,165,250,0.3)] group-hover:shadow-[0_0_18px_rgba(59,130,246,0.85),0_0_30px_rgba(96,165,250,0.6)] group-hover:w-[4.5px]'
        }`}
      />

      {/* Soft Ambient Inner Glow Reflection along left edge */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-20 pointer-events-none transition-opacity duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-[#F4B942]/12 via-[#F4B942]/4 to-transparent opacity-60 group-hover:opacity-100'
            : 'bg-gradient-to-r from-[#3B82F6]/12 via-[#3B82F6]/4 to-transparent opacity-60 group-hover:opacity-100'
        }`}
      />

      {/* Surface Content */}
      <div className={`relative z-10 ${paddingClass}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default PremiumCard;
