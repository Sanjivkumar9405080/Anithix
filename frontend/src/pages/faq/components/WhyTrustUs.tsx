import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageSquare,
  Target,
  Users,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const WhyTrustUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const pillars = [
    {
      id: 'pillar-1',
      number: '01',
      title: 'Clear Communication',
      tagline: 'Jargon-Free Clarity',
      description:
        'We explain architectural decisions, development trade-offs, and timelines in plain language so you make confident, informed choices.',
      icon: MessageSquare,
      highlight: '100% Transparent Syncs',
      direction: 'top-left',
    },
    {
      id: 'pillar-2',
      number: '02',
      title: 'Purpose-Driven Solutions',
      tagline: 'Rooted in Genuine Needs',
      description:
        'We engineer systems around actual operational requirements and workflows rather than chasing fashionable tech complexity.',
      icon: Target,
      highlight: 'Practical Utility First',
      direction: 'top-right',
    },
    {
      id: 'pillar-3',
      number: '03',
      title: 'Collaborative Approach',
      tagline: 'Shared Direction',
      description:
        'We treat you as a true partner with active prototype previews, shared roadmaps, and frequent milestone demos throughout.',
      icon: Users,
      highlight: 'Iterative Prototyping',
      direction: 'bottom-left',
    },
    {
      id: 'pillar-4',
      number: '04',
      title: 'Continuous Learning',
      tagline: 'Measured Refinement',
      description:
        'We measure user feedback and operational data as opportunities to continuously optimize performance, security, and user experience.',
      icon: TrendingUp,
      highlight: 'Continuous Optimization',
      direction: 'bottom-right',
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Scrubbed directional convergence timeline for desktop
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'center 45%',
          scrub: 1,
        },
      });

      // Subtle rotation for the center orbit
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          rotation: 180,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Animate cards from their outer directional offsets into their balanced positions
      tl.fromTo(
        '#trust-card-pillar-1',
        { x: -70, y: -40, opacity: 0.2 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 1 }
      )
      .fromTo(
        '#trust-card-pillar-2',
        { x: 70, y: -40, opacity: 0.2 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 1 },
        '<'
      )
      .fromTo(
        '#trust-card-pillar-3',
        { x: -70, y: 40, opacity: 0.2 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 1 },
        '<'
      )
      .fromTo(
        '#trust-card-pillar-4',
        { x: 70, y: 40, opacity: 0.2 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 1 },
        '<'
      )
      // Connecting SVG lines reveal
      .fromTo(
        '.trust-connecting-line',
        { strokeDashoffset: 300 },
        { strokeDashoffset: 0, ease: 'power2.out', duration: 0.8 },
        '<0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-white via-background-alt/40 to-white overflow-hidden border-t border-border"
    >
      {/* Background Soft Ambient Light */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-primary/10 via-sky/10 to-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>FOUNDATIONAL PRINCIPLES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-text-main tracking-tight leading-[1.12] mb-5">
            Why Clients Trust <br />
            <span className="gradient-text">ANTHIX.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans font-normal max-w-2xl mx-auto">
            We focus on clear communication, thoughtful technology, and solutions shaped around real needs.
          </p>
        </div>

        {/* Layered Composition with Central Orbit & 4 Information Cards */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Central Decorative Orbit (Desktop only) */}
          <div
            ref={orbitRef}
            className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-border/80 pointer-events-none items-center justify-center -z-10"
            aria-hidden="true"
          >
            {/* Inner Ring */}
            <div className="w-[200px] h-[200px] rounded-full border border-primary/20 border-dashed" />
            {/* Center Core Badge */}
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-soft-md border border-border flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            {/* Orbiting node dots */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-glow-primary" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-electric shadow-glow-electric" />
          </div>

          {/* 4 Layered Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.id}
                  id={`trust-card-${pillar.id}`}
                  className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-7 sm:p-9 border border-border hover:border-primary/40 shadow-[0_16px_36px_-6px_rgba(99,91,255,0.06)] hover:shadow-[0_20px_40px_-6px_rgba(99,91,255,0.12)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Gradient Edge Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#8B7CFF] to-sky rounded-t-3xl opacity-80" />

                  <div>
                    {/* Header: Number Badge + Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-soft-xs">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>

                      <span className="text-xs font-mono font-bold text-text-secondary bg-background-alt px-3 py-1 rounded-md border border-border">
                        {pillar.number}
                      </span>
                    </div>

                    {/* Tagline Eyebrow */}
                    <span className="text-xs font-bold uppercase tracking-wider text-primary font-sans mb-1.5 block">
                      {pillar.tagline}
                    </span>

                    {/* Card Title */}
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-text-main tracking-tight mb-3">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans font-normal mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Footer Badge */}
                  <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-text-main">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{pillar.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
