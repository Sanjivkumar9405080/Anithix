import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export const FAQHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-hero-item',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-background-alt/30 to-white"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-r from-background-lavender/60 via-background-softBlue/40 to-background-lavender/60 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow Label */}
        <div className="faq-hero-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>ANSWERS, WITHOUT THE GUESSWORK</span>
        </div>

        {/* Main Heading */}
        <h1 className="faq-hero-item font-heading font-black text-4xl sm:text-6xl md:text-7xl text-text-main tracking-tight leading-[1.08] mb-6">
          Good Questions. <br />
          <span className="gradient-text">Clear Answers.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="faq-hero-item text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 font-normal font-sans">
          Everything you need to know about working with ANTHIX, from digital solutions and AI automation to technical training.
        </p>

        {/* Minimal Understated Violet Accent Line */}
        <div className="faq-hero-item w-16 h-1 rounded-full bg-gradient-to-r from-primary via-[#8B7CFF] to-sky" />
      </div>
    </section>
  );
};
