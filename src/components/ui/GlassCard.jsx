import React from 'react';
import PremiumCard from './PremiumCard';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  neumorphic = false,
  gradientBorder = false,
  onClick,
  padding,
  ...props
}) => {
  return (
    <PremiumCard
      className={className}
      hoverEffect={hoverEffect}
      onClick={onClick}
      padding={padding}
      {...props}
    >
      {children}
    </PremiumCard>
  );
};

export default GlassCard;
