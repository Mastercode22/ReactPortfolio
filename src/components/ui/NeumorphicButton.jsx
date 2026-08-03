import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const NeumorphicButton = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const { isDark } = useTheme();

  let variantStyles = '';

  if (variant === 'primary') {
    variantStyles = isDark
      ? 'bg-gradient-to-r from-[#7C5CFF] to-[#5FA8FF] text-white shadow-[0_10px_25px_rgba(124,92,255,0.35)] hover:shadow-[0_15px_30px_rgba(124,92,255,0.5)] border border-white/20'
      : 'bg-gradient-to-r from-[#6C63FF] via-[#7C5CFF] to-[#5FA8FF] text-white shadow-[0_10px_25px_rgba(108,99,255,0.3)] hover:shadow-[0_15px_30px_rgba(108,99,255,0.45)] border border-white/40';
  } else if (variant === 'secondary') {
    variantStyles = isDark
      ? 'neu-flat-dark text-[#F8FAFC] hover:text-[#7C5CFF] active:neu-pressed-dark'
      : 'neu-flat-light text-[#1B2430] hover:text-[#6C63FF] active:neu-pressed-light';
  } else if (variant === 'glass') {
    variantStyles = isDark
      ? 'glass-card-dark text-[#F8FAFC] border border-white/10 hover:border-[#7C5CFF]/50 hover:bg-white/5'
      : 'glass-card-light text-[#1B2430] border border-white/80 hover:border-[#6C63FF]/50 hover:bg-white/80';
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer select-none ${variantStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />}
      <span>{children}</span>
    </motion.button>
  );
};

export default NeumorphicButton;
