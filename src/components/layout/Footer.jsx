import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Twitter, Mail, Send, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const footerNavLinks = [
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

export const Footer = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="relative pt-20 pb-12 border-t border-white/10 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-[#6C63FF]/10 via-[#7C5CFF]/15 to-[#5FA8FF]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            {/* Logo with Lightning Aura Glow */}
            <motion.div
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative inline-flex items-center cursor-pointer select-none group p-1"
            >
              {/* Lightning Aura Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B]/60 via-[#7C5CFF]/50 to-[#3B82F6]/60 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-pulse pointer-events-none" />

              <img
                src="/logo.png"
                alt="Rapid Render Logo"
                className="relative z-10 h-12 sm:h-14 w-auto object-contain transition-transform duration-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(245,158,11,0.9)]"
              />
            </motion.div>
            
            <p className="text-sm text-[#667085] dark:text-[#CBD5E1] max-w-md leading-relaxed">
              Crafting world-class digital experiences blending Neumorphic depth, Glassmorphism, and Apple-grade precision engineering.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Github, href: 'https://github.com/Rapid Renderquarshie', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/Rapid Renderquarshie', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://twitter.com/Rapid Renderquarshie', label: 'Twitter' },
                { icon: Mail, href: 'mailto:Rapid Render.quarshie@example.com', label: 'Email' }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  className={`p-3 rounded-2xl transition-all ${
                    isDark
                      ? 'neu-flat-dark text-[#CBD5E1] hover:text-[#7C5CFF]'
                      : 'neu-flat-light text-[#667085] hover:text-[#6C63FF]'
                  }`}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC] mb-4">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {footerNavLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="text-[#667085] dark:text-[#CBD5E1] hover:text-[#6C63FF] dark:hover:text-[#7C5CFF] transition-colors"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
              Subscribe to Insights
            </h4>
            <p className="text-xs text-[#667085] dark:text-[#CBD5E1]">
              Get periodic updates on digital design systems, React 19 architecture, and UI trends.
            </p>

            <form onSubmit={handleNewsletter} className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full py-3 pl-4 pr-12 rounded-2xl text-xs font-medium outline-none transition-all ${
                  isDark ? 'neu-pressed-dark text-white placeholder-slate-500' : 'neu-pressed-light text-slate-800 placeholder-slate-400'
                }`}
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#5FA8FF] text-white shadow-md hover:scale-105 transition-transform"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-500 font-semibold">Thank you for subscribing!</p>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085] dark:text-[#CBD5E1]">
          <p>© {new Date().getFullYear()} Rapid Render Quarshie. All rights reserved. Crafted with React 19 & Tailwind CSS.</p>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold transition-all ${
              isDark ? 'neu-flat-dark text-white' : 'neu-flat-light text-[#1B2430]'
            }`}
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#7C5CFF]" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
