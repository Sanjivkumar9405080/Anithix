import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { AboutHeroVisual } from './AboutHeroVisual';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export const AboutHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.5'
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          visualRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
          '-=0.9'
        );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] lg:min-h-[90vh] pt-12 lg:pt-16 pb-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Background Soft Lighting Gradients */}
      <div 
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-background-lavender via-[#EAF6FF]/60 to-white rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Heading & Content */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          {/* Label */}
          <div
            ref={labelRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>GET TO KNOW ANTHIX</span>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-main tracking-tight leading-[1.08] mb-6"
          >
            We Turn Ideas Into <span className="gradient-text">Impact.</span>
          </h1>

          {/* Supporting Text */}
          <p
            ref={textRef}
            className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 font-normal font-sans"
          >
            ANTHIX brings together digital solutions, artificial intelligence, automation, and technical learning to help businesses and institutions move forward with confidence.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/services">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4 ml-0.5" />}>
                Explore Our Services
              </Button>
            </Link>

            <Link to="/contact">
              <Button variant="outline" size="lg">
                Let's Talk
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Animated Visual */}
        <div
          ref={visualRef}
          className="lg:col-span-5 relative w-full flex items-center justify-center"
        >
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-sky-400/10 to-primary/10 blur-2xl transform scale-90 -z-10"
            aria-hidden="true"
          />
          <AboutHeroVisual className="w-full h-[380px] sm:h-[460px] lg:h-[520px]" />
        </div>
      </div>
    </section>
  );
};
