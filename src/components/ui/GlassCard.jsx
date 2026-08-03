import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  neumorphic = false,
  gradientBorder = false,
  onClick,
  ...props
}) => {
  const { isDark } = useTheme();

  let baseStyle = '';
  if (neumorphic) {
    baseStyle = isDark ? 'neu-card-dark' : 'neu-card-light';
  } else {
    baseStyle = isDark ? 'glass-card-dark' : 'glass-card-light';
  }

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -6, scale: 1.01 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-300 ${baseStyle} ${gradientBorder ? 'gradient-border' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
