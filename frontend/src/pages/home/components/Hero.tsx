import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { HeroScene3D } from './HeroScene3D';
import { Button } from '../../../components/common/Button';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onExploreClick?: () => void;
  onContactClick?: () => void;
}

export const Hero = ({ onExploreClick, onContactClick }: HeroProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const bgLightRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metaLineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgLightRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2 }
      )
        .fromTo(
          visualRef.current,
          { opacity: 0, scale: 0.88, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' },
          '-=0.9'
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.9'
        )
        .fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current],
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 },
          '-=0.6'
        )
        .fromTo(
          paragraphRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          metaLineRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          '-=0.4'
        );

      if (heroRef.current && contentRef.current) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom 20%',
            scrub: 1,
          },
          y: -50,
          opacity: 0.65,
          ease: 'power1.out',
        });
      }

      if (heroRef.current && visualRef.current) {
        gsap.to(visualRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: 40,
          scale: 0.92,
          ease: 'none',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] lg:min-h-screen pt-20 lg:pt-24 pb-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Soft atmospheric gradients */}
      <div
        ref={bgLightRef}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-background-lavender/90 via-[#EAF6FF]/70 to-white rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 -right-24 w-[480px] h-[480px] bg-sky-400/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Typography & CTAs */}
        <div ref={contentRef} className="lg:col-span-7 flex flex-col items-start z-10">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>YOUR PARTNER IN DIGITAL INNOVATION</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-main tracking-tight leading-[1.08] mb-6">
            <span ref={headlineLine1Ref} className="block">
              Ideas Into
            </span>
            <span ref={headlineLine2Ref} className="block gradient-text">
              Impact.
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            ref={paragraphRef}
            className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 font-normal font-sans"
          >
            We help businesses and institutions turn ambitious ideas into digital experiences, intelligent automation, and practical technology solutions.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10"
          >
            <Button
              size="lg"
              onClick={() => {
                if (onExploreClick) onExploreClick();
                else handleScrollTo('services');
              }}
              icon={<ArrowRight className="w-4 h-4 ml-0.5" />}
              className="w-full sm:w-auto"
            >
              Explore Our Services
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (onContactClick) onContactClick();
                else handleScrollTo('contact');
              }}
              className="w-full sm:w-auto"
            >
              Let's Talk
            </Button>
          </div>

          {/* Small Line */}
          <div
            ref={metaLineRef}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text-secondary border-t border-border/80 pt-5 w-full max-w-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Digital Solutions</span>
            <span className="text-border">·</span>
            <span>AI & Automation</span>
            <span className="text-border">·</span>
            <span>Technical Training</span>
          </div>
        </div>

        {/* Right Column: Interactive 3D Visual */}
        <div 
          ref={visualRef} 
          className="lg:col-span-5 relative w-full flex items-center justify-center"
        >
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-sky-400/10 to-primary/10 blur-2xl transform scale-90 -z-10"
            aria-hidden="true"
          />
          <HeroScene3D className="w-full h-[400px] sm:h-[480px] lg:h-[560px]" />
        </div>
      </div>

      {/* Scroll indicator prompt */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-text-secondary">Scroll to explore</span>
        <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
      </div>
    </section>
  );
};
