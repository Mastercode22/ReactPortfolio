import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const DeviceMockup = ({ projectImage = '/images/ecom.jpg' }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10 to +10 deg
      const y = (e.clientY / innerHeight - 0.5) * -20; // -10 to +10 deg
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto perspective-1000 py-6">
      {/* Soft Ambient Blob Shadow underneath */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-r from-[#6C63FF]/30 to-[#5FA8FF]/30 rounded-full blur-2xl opacity-70 animate-pulse" />

      {/* Main Floating 3D MacBook Container */}
      <motion.div
        animate={{
          rotateY: mousePos.x,
          rotateX: mousePos.y,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 w-full animate-float-slow transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* MacBook Screen */}
        <div className="relative rounded-t-2xl bg-[#1B2430] p-3 border-4 border-[#2A3444] shadow-2xl overflow-hidden">
          {/* Top Notch / Camera Dot */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#111827] rounded-b-md z-30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* Screen Display content */}
          <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-[16/10] group">
            <img
              src={projectImage}
              alt="MacBook Preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            
            {/* Live Indicator Pill */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full glass-card-dark text-[11px] font-medium text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Interactive Demo
            </div>
          </div>
        </div>

        {/* MacBook Keyboard Base */}
        <div className="relative w-[108%] -left-[4%] h-4 bg-gradient-to-b from-[#2A3444] to-[#1B2430] rounded-b-xl border-t border-white/20 shadow-xl flex justify-center items-center">
          <div className="w-16 h-1 bg-slate-600/50 rounded-full" />
        </div>
      </motion.div>

      {/* Floating Overlaid Smartphone Mockup */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotateY: mousePos.x * 1.2,
          rotateX: mousePos.y * 1.2,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotateY: { type: 'spring', stiffness: 120 },
          rotateX: { type: 'spring', stiffness: 120 },
        }}
        className="absolute -bottom-4 -right-4 sm:-right-8 z-20 w-36 sm:w-44 rounded-3xl bg-[#1B2430] p-2 border-2 border-[#3A4556] shadow-2xl transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative rounded-2xl overflow-hidden aspect-[9/19] bg-slate-900">
          <img
            src="/images/ecm.jpg"
            alt="Mobile Preview"
            className="w-full h-full object-cover"
          />
          {/* Mobile Speaker / Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-black rounded-full z-20" />
        </div>
      </motion.div>
    </div>
  );
};

export default DeviceMockup;
