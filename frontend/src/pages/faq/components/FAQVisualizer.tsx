import React from 'react';
import {
  Sparkles,
  Code2,
  Bot,
  Layers,
  GraduationCap,
  Users,
  MessageSquare,
} from 'lucide-react';
import { ScrollFAQItem } from '../data/scrollFaqData';

interface FAQVisualizerProps {
  activeIndex: number;
  progressRatio: number;
  items: ScrollFAQItem[];
  className?: string;
}

export const FAQVisualizer: React.FC<FAQVisualizerProps> = ({
  activeIndex,
  progressRatio,
  items,
  className = '',
}) => {
  const total = items.length;
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Icon mapping
  const renderCenterIcon = (name: string) => {
    const iconProps = { className: 'w-7 h-7 text-primary transition-all duration-300' };
    switch (name) {
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'code':
        return <Code2 {...iconProps} />;
      case 'bot':
        return <Bot {...iconProps} />;
      case 'layers':
        return <Layers {...iconProps} />;
      case 'graduation-cap':
        return <GraduationCap {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'message-square':
        return <MessageSquare {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  const currentItem = items[activeIndex] || items[0];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {/* Soft Ambient Radial Light Orb */}
      <div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary/15 via-sky/15 to-primary/5 blur-2xl -z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `scale(${1 + (activeIndex % 3) * 0.08}) rotate(${activeIndex * 45}deg)`,
        }}
      />

      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
        {/* SVG Circular Track and Progress Arc */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 260 260"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="faqOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#635BFF" />
              <stop offset="50%" stopColor="#8B7CFF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <radialGradient id="faqCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F0EDFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Background Outer Track Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="#E8EAF2"
            strokeWidth="2"
            strokeDasharray="4 6"
            className="transition-transform duration-700"
            style={{
              transformOrigin: 'center',
              transform: `rotate(${activeIndex * 25}deg)`,
            }}
          />

          {/* Active Dynamic Progress Arc */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="url(#faqOrbGrad)"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />

          {/* Inner Decorative Hairline Ring */}
          <circle
            cx="130"
            cy="130"
            r="68"
            fill="none"
            stroke="#E8EAF2"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            className="opacity-70"
          />
        </svg>

        {/* 7 Orbital Node Markers along the track */}
        {items.map((item, idx) => {
          const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
          const r = radius;
          // Center coordinate is 130, scale to percentage or px
          const x = 130 + r * Math.cos(angle);
          const y = 130 + r * Math.sin(angle);
          const percentX = (x / 260) * 100;
          const percentY = (y / 260) * 100;

          const isActive = activeIndex === idx;
          const isPassed = activeIndex > idx;

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${percentX}%`,
                top: `${percentY}%`,
              }}
            >
              {isActive ? (
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-7 h-7 rounded-full bg-primary/20 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-glow-primary border-2 border-white">
                    {item.number}
                  </div>
                </div>
              ) : isPassed ? (
                <div className="w-4 h-4 rounded-full bg-primary/80 border border-white flex items-center justify-center text-white text-[8px] font-bold shadow-soft-xs">
                  ✓
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-border flex items-center justify-center" />
              )}
            </div>
          );
        })}

        {/* Central Core Element */}
        <div className="relative w-28 h-28 rounded-full bg-white/95 backdrop-blur-md border border-border shadow-soft-md flex flex-col items-center justify-center z-10 transition-transform duration-300">
          {/* Subtle Radial Glow behind icon */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-background-lavender/50 to-transparent -z-10" />

          {/* Dynamic Category Icon */}
          <div className="mb-1 transform transition-all duration-300 scale-100">
            {renderCenterIcon(currentItem.iconName)}
          </div>

          {/* Step Pill Counter */}
          <div className="px-2 py-0.5 rounded-full bg-background-lavender text-primary-deep text-[10px] font-mono font-bold tracking-wider uppercase border border-primary/20">
            {currentItem.number} / 0{total}
          </div>
        </div>
      </div>
    </div>
  );
};
