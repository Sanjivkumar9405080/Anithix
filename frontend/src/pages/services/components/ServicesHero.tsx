import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ServicesHeroVisual } from './ServicesHeroVisual';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export const ServicesHero = () => {
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
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1 }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          visualRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' },
          '-=0.8'
        );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleScrollToOverview = () => {
    const el = document.getElementById('services-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] lg:min-h-[90vh] pt-12 lg:pt-16 pb-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Background Soft Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-gradient-to-tr from-background-lavender via-background-softBlue/60 to-white rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-10 w-[480px] h-[480px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Heading & Content */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          {/* Label */}
          <div
            ref={labelRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>WHAT WE DO</span>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-main tracking-tight leading-[1.08] mb-6"
          >
            Technology That Moves You <span className="gradient-text">Forward.</span>
          </h1>

          {/* Supporting Text */}
          <p
            ref={textRef}
            className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8 font-normal font-sans"
          >
            From powerful digital experiences to intelligent automation and practical technical training, ANTHIX helps businesses and institutions turn complex challenges into meaningful outcomes.
          </p>

          {/* Action CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={handleScrollToOverview}
              icon={<ArrowDown className="w-4 h-4 ml-1" />}
              className="w-full sm:w-auto"
            >
              Explore Our Services
            </Button>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                icon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="w-full sm:w-auto"
              >
                Let&apos;s Talk
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive 3D Technology Visual */}
        <div
          ref={visualRef}
          className="lg:col-span-5 flex items-center justify-center relative w-full"
        >
          <ServicesHeroVisual />
        </div>
      </div>
    </section>
  );
};
