import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const MouseGlow = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const { isDark } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-30 transition-opacity duration-500 rounded-full blur-[120px]"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: '380px',
        height: '380px',
        transform: 'translate(-50%, -50%)',
        background: isDark
          ? 'radial-gradient(circle, rgba(124,92,255,0.22) 0%, rgba(95,168,255,0.15) 50%, transparent 80%)'
          : 'radial-gradient(circle, rgba(108,99,255,0.16) 0%, rgba(139,123,255,0.1) 50%, transparent 80%)',
      }}
    />
  );
};

export default MouseGlow;
