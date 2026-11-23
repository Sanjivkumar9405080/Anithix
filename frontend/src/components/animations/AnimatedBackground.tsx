import React from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'hero' | 'section' | 'cta';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  variant = 'section',
}) => {
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`} aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-background-lavender/90 via-[#EAF6FF]/70 to-white rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-[480px] h-[480px] bg-sky-400/10 rounded-full blur-3xl" />
      </div>
    );
  }

  if (variant === 'cta') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-0 ${className}`} aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[950px] h-[380px] sm:h-[480px] bg-gradient-to-r from-primary/15 via-sky-400/15 to-primary/10 rounded-[120px] blur-3xl transform -rotate-3" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full border border-primary/20 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full border border-sky-400/20" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`} aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-background-lavender/60 rounded-full blur-3xl" />
    </div>
  );
};
