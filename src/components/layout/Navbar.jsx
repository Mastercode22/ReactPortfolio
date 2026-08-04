import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experience', path: '/experience' },
  { name: 'Certifications', path: '/certifications' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
  { name: 'Resume', path: '/resume' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <nav
          className={`relative rounded-3xl transition-all duration-500 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 ${
            scrolled
              ? isDark
                ? 'glass-nav-dark py-2 shadow-2xl backdrop-blur-xl border-white/10'
                : 'glass-nav-light py-2 shadow-lg backdrop-blur-xl border-white/80'
              : isDark
                ? 'bg-[#171E2F]/60 backdrop-blur-md border border-white/5'
                : 'bg-white/60 backdrop-blur-md border border-white/60 shadow-sm'
          }`}
        >
          {/* Logo with Glowing Lightning Effect */}
          <motion.div
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex items-center cursor-pointer select-none group p-1"
          >
            {/* Lightning Aura Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B]/60 via-[#7C5CFF]/50 to-[#3B82F6]/60 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-pulse pointer-events-none" />

            <img
              src="/logo.png"
              alt="Rapid Render Logo"
              className="relative z-10 h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(245,158,11,0.9)]"
            />
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive: linkActive }) =>
                    `relative px-3.5 py-2 rounded-2xl text-xs xl:text-sm font-semibold transition-all duration-300 ${
                      linkActive || isActive
                        ? 'text-[#6C63FF] dark:text-[#7C5CFF]'
                        : 'text-[#1B2430]/70 dark:text-[#F8FAFC]/70 hover:text-[#6C63FF] dark:hover:text-[#7C5CFF]'
                    }`
                  }
                >
                  {({ isActive: linkActive }) => (
                    <>
                      {(linkActive || isActive) && (
                        <motion.div
                          layoutId="activePill"
                          className={`absolute inset-0 rounded-2xl ${
                            isDark ? 'neu-pressed-dark' : 'neu-pressed-light'
                          }`}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Actions: Mobile Quick Links (About & Contact), Theme Toggle, Hire Button & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Quick Links: ONLY visible on screens smaller than lg */}
            <div className="flex lg:hidden items-center gap-1">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/30'
                        : 'bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30'
                      : 'text-[#1B2430] dark:text-[#F8FAFC] hover:text-[#6C63FF] dark:hover:text-[#7C5CFF]'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/30'
                        : 'bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30'
                      : 'text-[#1B2430] dark:text-[#F8FAFC] hover:text-[#6C63FF] dark:hover:text-[#7C5CFF]'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>

            <ThemeToggle />

            {/* Desktop CTA Resume / Contact Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-[#7C5CFF] to-[#5FA8FF] text-white shadow-[0_4px_15px_rgba(124,92,255,0.3)]'
                  : 'bg-gradient-to-r from-[#6C63FF] to-[#7C5CFF] text-white shadow-[0_4px_15px_rgba(108,99,255,0.25)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hire Me</span>
            </motion.button>

            {/* Mobile Hamburger Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-2xl transition-all ${
                isDark ? 'neu-flat-dark text-white' : 'neu-flat-light text-[#1B2430]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </nav>
      </div>

      {/* Slide-in Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden mt-3 max-w-7xl mx-auto overflow-hidden"
          >
            <div
              className={`rounded-3xl p-6 space-y-2 shadow-2xl ${
                isDark ? 'glass-nav-dark border-white/10' : 'glass-nav-light border-white/80'
              }`}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? isDark
                          ? 'neu-pressed-dark text-[#7C5CFF]'
                          : 'neu-pressed-light text-[#6C63FF]'
                        : 'text-[#1B2430] dark:text-[#F8FAFC] hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                );
              })}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/contact');
                  }}
                  className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#6C63FF] to-[#5FA8FF] text-white shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
