import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Sparkles, ArrowDown, ArrowRight, Layers, Bot } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export const ProjectsHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-hero-elem',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );

      // Subtle float for background decorative badges
      gsap.to('.hero-float-badge-1', {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.hero-float-badge-2', {
        y: 10,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const scrollToProjects = () => {
    const el = document.getElementById('project-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 bg-gradient-to-b from-white via-background-lavender/25 to-white overflow-hidden"
    >
      {/* Background Soft Ambient Light Orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-gradient-to-r from-background-lavender/60 via-background-softBlue/40 to-background-lavender/60 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative Floating Badges */}
      <div
        className="hero-float-badge-1 hidden xl:flex absolute top-28 left-16 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-border shadow-soft-sm items-center gap-2.5 -z-10 select-none"
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold font-heading text-text-main">Custom Software</div>
          <div className="text-[10px] text-text-secondary">Engineered Architecture</div>
        </div>
      </div>

      <div
        className="hero-float-badge-2 hidden xl:flex absolute top-36 right-16 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-border shadow-soft-sm items-center gap-2.5 -z-10 select-none"
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold font-heading text-text-main">Intelligent Systems</div>
          <div className="text-[10px] text-text-secondary">Workflow Automation</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow: WHAT WE CAN BUILD */}
        <div className="projects-hero-elem inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>WHAT WE CAN BUILD</span>
        </div>

        {/* Heading: Ideas Into Impact. */}
        <h1 className="projects-hero-elem font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-text-main tracking-tight leading-[1.08] mb-6">
          Ideas Into <span className="gradient-text">Impact.</span>
        </h1>

        {/* Supporting Text */}
        <p className="projects-hero-elem text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10 font-normal font-sans">
          Explore technology solutions for businesses, educational institutions, healthcare organizations, and communities.
        </p>

        {/* CTA Buttons */}
        <div className="projects-hero-elem flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={scrollToProjects}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-deep text-white font-heading font-bold text-sm shadow-soft-md hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
          >
            <span>Explore Concepts</span>
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-background-alt text-text-main font-heading font-semibold text-sm border border-border shadow-soft-xs transition-colors duration-200"
          >
            <span>Discuss Your Project</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>

        {/* Minimal Understated Accent Line */}
        <div className="projects-hero-elem w-16 h-1 rounded-full bg-gradient-to-r from-primary via-[#8B7CFF] to-sky mt-12" />
      </div>
    </section>
  );
};
