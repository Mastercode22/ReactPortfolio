import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const BrandSvgLoader = ({ size = 170, statusText = "INITIALIZING ARCHITECTURE", className = "" }) => {
  const { isDark } = useTheme();

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F6F7FB] dark:bg-[#090B13] text-[#1B2430] dark:text-[#F8FAFC] transition-all duration-400 select-none ${className}`}>
      <div className="flex flex-col items-center gap-7">
        {/* Loader Core Wrapper */}
        <div className="relative flex items-center justify-center w-[170px] h-[170px]">
          {/* Blueprint SVG Rings & Framing Brackets */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            width={size}
            height={size}
            className="w-auto h-auto max-w-[80vw] max-h-[80vh]"
          >
            <defs>
              {/* Light Mode Blue Gradient */}
              <linearGradient id="reactLoaderGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="50%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#5FA8FF" />
              </linearGradient>
              {/* Dark Mode Gold Gradient */}
              <linearGradient id="reactLoaderGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Outer Rotating Blueprint Ring */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="8 6 16 6"
              className="origin-center animate-[loaderSpin_14s_linear_infinite] opacity-35"
            />

            {/* Blueprint Compass Ticks */}
            <circle
              cx="100"
              cy="100"
              r="76"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1 11"
              className="origin-center animate-[loaderSpinRev_22s_linear_infinite] opacity-25"
            />

            {/* Inner Reference Ring */}
            <circle
              cx="100"
              cy="100"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="1"
            />

            {/* Developer Brackets < > Framing Logo */}
            <g className="origin-center animate-[loaderPulse_2.5s_ease-in-out_infinite]">
              {/* Left Bracket < */}
              <path
                d="M 44 80 L 28 100 L 44 120"
                fill="none"
                stroke={isDark ? "url(#reactLoaderGradDark)" : "url(#reactLoaderGradLight)"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Right Bracket > */}
              <path
                d="M 156 80 L 172 100 L 156 120"
                fill="none"
                stroke={isDark ? "url(#reactLoaderGradDark)" : "url(#reactLoaderGradLight)"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>

          {/* User's Official Logo Image in Center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Glowing Aura */}
            <div
              className={`absolute w-20 h-20 rounded-full blur-xl opacity-70 animate-pulse ${
                isDark ? 'bg-[#F59E0B]/30' : 'bg-[#6C63FF]/25'
              }`}
            />
            <img
              src="/logo.png"
              alt="Rapid Render Logo"
              className={`relative z-10 max-w-[80px] max-h-[80px] w-auto h-auto object-contain animate-[loaderPulse_2.5s_ease-in-out_infinite] ${
                isDark
                  ? 'drop-shadow-[0_0_18px_rgba(245,158,11,0.7)]'
                  : 'drop-shadow-[0_0_14px_rgba(108,99,255,0.5)]'
              }`}
            />
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center gap-2.5 tracking-[0.25em] text-[11px] font-bold uppercase text-[#64748B] dark:text-[#94A3B8]">
          <span className="w-1.75 h-1.75 rounded-full bg-[#6C63FF] dark:bg-[#F59E0B] animate-pulse shadow-[0_0_10px_rgba(108,99,255,0.6)] dark:shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
};

export default BrandSvgLoader;
