import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sliders, ShieldAlert } from 'lucide-react';
import { anthixCapabilities } from '../data/projectsData';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ProjectCapabilities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.capability-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
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
      className="py-24 sm:py-32 px-4 sm:px-8 bg-white relative border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20 shadow-soft-xs">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>EXTENSIVE CAPABILITIES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main tracking-tight leading-[1.12] mb-5">
            Built Around <span className="gradient-text">Your Needs.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans font-normal">
            The project categories above represent foundational architectures, not rigid boundaries. We adapt our full-stack engineering stack and AI capabilities around your exact operating goals.
          </p>
        </div>

        {/* Capabilities Grid (11 Capabilities) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {anthixCapabilities.map((cap, idx) => (
            <div
              key={cap.title}
              className="capability-card p-6 rounded-2xl bg-background-alt/70 border border-border hover:border-primary/40 hover:bg-white hover:shadow-soft-sm transition-all duration-200 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                {idx < 9 ? `0${idx + 1}` : idx + 1}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text-main mb-1.5 flex items-center gap-2">
                  <span>{cap.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {cap.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pragmatic Consultation Disclaimer / Note */}
        <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-background-lavender/50 border border-primary/20 flex items-start sm:items-center gap-4 text-xs text-text-secondary">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed font-sans">
            <strong className="text-text-main font-semibold">Honest Collaboration:</strong> Final scope, architectural stack, and project timelines are evaluated collaboratively based on technical feasibility, operational requirements, and agreed roadmap milestones.
          </p>
        </div>
      </div>
    </section>
  );
};
