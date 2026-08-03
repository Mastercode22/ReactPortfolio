import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer select-none ${
        isDark
          ? 'neu-flat-dark text-[#8B7BFF] hover:text-white hover:shadow-[0_0_15px_rgba(124,92,255,0.4)]'
          : 'neu-flat-light text-[#6C63FF] hover:text-[#1B2430] hover:shadow-[0_0_15px_rgba(108,99,255,0.3)]'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.35, ease: 'backOut' }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-[#8B7BFF] fill-[#8B7BFF]/20" />
        ) : (
          <Sun className="w-5 h-5 text-[#6C63FF] fill-[#6C63FF]/20" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
