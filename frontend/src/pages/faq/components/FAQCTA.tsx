import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const FAQCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-cta-elem',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-white via-background-lavender/25 to-background-lavender/50 overflow-hidden border-t border-border"
    >
      {/* Contained Visual Panel with Subtle Violet-Blue Ambient Lighting */}
      <div className="max-w-5xl mx-auto relative">
        {/* Soft Ambient Radial Light Orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-r from-primary/15 via-sky/15 to-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"
          aria-hidden="true"
        />

        <div
          ref={cardRef}
          className="relative bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-[36px] p-8 sm:p-14 lg:p-16 border border-border/80 shadow-[0_24px_60px_rgba(99,91,255,0.08)] text-center flex flex-col items-center overflow-hidden"
        >
          {/* Top Decorative Border Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[#8B7CFF] to-sky" />

          {/* Eyebrow: HAVE AN IDEA? */}
          <div className="faq-cta-elem inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>HAVE AN IDEA?</span>
          </div>

          {/* Large Confident Heading: Let's Build Something Meaningful. */}
          <h2 className="faq-cta-elem font-heading font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-text-main tracking-tight leading-[1.08] max-w-3xl mb-6">
            Let&apos;s Build Something{' '}
            <span className="gradient-text">Meaningful.</span>
          </h2>

          {/* Supporting text */}
          <p className="faq-cta-elem text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10 font-sans font-normal">
            From digital products to AI-powered workflows, ANTHIX helps turn ideas into practical technology solutions.
          </p>

          {/* Polished Pill-Shaped CTA Button: Start Your Project */}
          <div className="faq-cta-elem flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary hover:bg-primary-deep text-white font-heading font-bold text-base shadow-soft-md hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/approach"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-background-alt text-text-main font-heading font-semibold text-sm border border-border transition-colors duration-200"
            >
              <span>Explore Our Approach</span>
            </Link>
          </div>

          {/* Subtle Trust Assurance Text */}
          <p className="faq-cta-elem mt-8 text-xs text-text-secondary font-medium tracking-wide">
            ✓ Direct consultation with technical founders • No obligation • Prompt response
          </p>
        </div>
      </div>
    </section>
  );
};
