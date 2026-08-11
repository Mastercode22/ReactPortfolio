import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Download, Eye, Terminal } from 'lucide-react';
import NeumorphicButton from '../ui/NeumorphicButton';
import DeviceMockup from '../ui/DeviceMockup';
import { useTheme } from '../../context/ThemeContext';
import { getHero } from '../../services/heroService';
import { downloadCv } from '../../services/cvService';

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 w-full">
    <div className="h-12 bg-white/10 rounded-2xl w-3/4" />
    <div className="h-6 bg-white/10 rounded-xl w-full" />
    <div className="h-6 bg-white/10 rounded-xl w-2/3" />
  </div>
);

export const Hero = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHero = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getHero();
      setHeroData({
        headlines: [data.headline_1, data.headline_2, data.headline_3, data.headline_4].filter(Boolean),
        bio: data.bio,
        availability: data.availability_text
      });
    } catch (err) {
      console.error(err);
      setError(true);
      // Fallback data
      setHeroData({
        headlines: [
          "I Design & Build Premium Web Experiences",
          "React 19 & Tailwind CSS Architect",
          "Neumorphic & Glassmorphic UI Pioneer",
          "Transforming Complexity into Elegant Software"
        ],
        bio: "I blend luxury digital aesthetics with ultra-fast React 19 single-page architecture. Specializing in Neumorphism, Glassmorphism, 60 FPS motion design, and high-conversion enterprise interfaces.",
        availability: "Available for Selective Client Projects"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // Typing Effect Logic
  useEffect(() => {
    if (!heroData || heroData.headlines.length === 0) return;
    
    const currentFullText = heroData.headlines[headlineIndex] || '';
    const speed = isDeleting ? 30 : 70;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setHeadlineIndex((prev) => (prev + 1) % heroData.headlines.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, headlineIndex, heroData]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12 lg:py-20">
      {/* Background Motion Video (hero-animation.mp4) - Full Screen Coverage from Very Top Edge */}
      <div className="absolute -top-36 sm:-top-44 lg:-top-52 -inset-x-0 bottom-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-65 dark:opacity-65 transition-opacity duration-500 scale-105"
        >
          {/* ── Mobile (≤768px): 480px-wide compressed version — ~75% smaller file ── */}
          <source
            media="(max-width: 768px)"
            src="https://res.cloudinary.com/dhxh1s2h/video/upload/w_480,q_auto,f_webm/v1786446737/hero-animation.mp4"
            type="video/webm"
          />
          <source
            media="(max-width: 768px)"
            src="https://res.cloudinary.com/dhxh1s2h/video/upload/w_480,q_auto/v1786446737/hero-animation.mp4"
            type="video/mp4"
          />
          {/* ── Desktop: Full quality WebM (smaller than MP4) ── */}
          <source
            src="https://res.cloudinary.com/dhxh1s2h/video/upload/q_auto,f_webm/v1786446737/hero-animation.mp4"
            type="video/webm"
          />
          {/* ── Desktop: MP4 fallback (Safari) ── */}
          <source
            src="https://res.cloudinary.com/dhxh1s2h/video/upload/q_auto/v1786446737/hero-animation.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Seamless Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F7FB]/20 via-[#F6F7FB]/30 to-[#F6F7FB]/90 dark:from-[#090B13]/30 dark:via-[#090B13]/40 dark:to-[#090B13]/90" />
      </div>

      {/* Background Soft Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#5FA8FF]/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow z-0" />

      {/* Floating Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute rounded-full bg-[#6C63FF]"
            style={{
              width: `${12 + i * 4}px`,
              height: `${12 + i * 4}px`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 14}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Hero Title & Action Buttons */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {loading ? (
              <LoadingSkeleton />
            ) : error && !heroData ? (
              <div className="text-center py-12 text-[#667085]">
                <p className="text-sm">Failed to load content.</p>
                <button onClick={fetchHero} className="text-[#6C63FF] text-xs mt-2 underline">Try again</button>
              </div>
            ) : (
              <>
                {/* Status Pill */}
                {heroData.availability && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/80 dark:bg-[#171E2F]/80 text-[#6C63FF] dark:text-[#7C5CFF] border border-[#6C63FF]/30 backdrop-blur-md shadow-sm"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{heroData.availability}</span>
                  </motion.div>
                )}

                {/* Typing Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="min-h-[140px] sm:min-h-[160px] flex items-center"
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.15]">
                    {displayText}
                    <span className="inline-block w-1 h-10 sm:h-12 bg-[#6C63FF] dark:bg-[#7C5CFF] ml-1 animate-pulse" />
                  </h1>
                </motion.div>

                {/* Introduction Bio - High Contrast & Visibility in Light Mode */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg text-[#0F172A] dark:text-[#E2E8F0] max-w-xl font-bold leading-[1.75] tracking-normal drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-none"
                >
                  {heroData.bio}
                </motion.p>
              </>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <NeumorphicButton
                variant="primary"
                onClick={() => navigate('/contact')}
                icon={Sparkles}
              >
                Hire Me
              </NeumorphicButton>

              <NeumorphicButton
                variant="secondary"
                onClick={() => navigate('/projects')}
                icon={Eye}
              >
                View Projects
              </NeumorphicButton>

              <NeumorphicButton
                variant="glass"
                onClick={() => downloadCv()}
                icon={Download}
              >
                Download CV
              </NeumorphicButton>
            </motion.div>

            {/* Micro Badge Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 border-t border-[#0F172A]/15 dark:border-white/10 flex items-center gap-8 text-xs font-bold text-[#0F172A] dark:text-[#CBD5E1]"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#6C63FF]" />
                <span>Clean Code Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>99.9% Lighthouse Score</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating 3D Device Mockup (Desktop + Phone) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <DeviceMockup projectImage="/images/ecom.jpg" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
