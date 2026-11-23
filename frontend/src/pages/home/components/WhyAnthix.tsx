import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, CheckCircle2, Lightbulb, RefreshCw, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const WhyAnthix = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePrinciple, setActivePrinciple] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const principles = [
    {
      number: '01',
      title: 'PURPOSE FIRST',
      statement: 'Understand the problem before choosing the technology.',
      description: 'We avoid forcing fashionable tools onto problems that require straightforward execution. Technology serves the mission, never the other way around.',
      icon: Target,
      highlight: 'Problem-driven roadmap',
    },
    {
      number: '02',
      title: 'PRACTICAL SOLUTIONS',
      statement: 'Focus on approaches that address actual needs.',
      description: 'We prioritize tangible value: software that works reliably, automations that genuinely save administrative time, and training that students can apply immediately.',
      icon: CheckCircle2,
      highlight: 'Direct real-world utility',
    },
    {
      number: '03',
      title: 'MODERN THINKING',
      statement: 'Explore relevant tools, thoughtful design, and useful technology.',
      description: 'Leveraging contemporary frontend stacks, modern API standards, and current AI capabilities so your digital architecture remains agile and maintainable.',
      icon: Lightbulb,
      highlight: 'Contemporary standards',
    },
    {
      number: '04',
      title: 'CONTINUOUS IMPROVEMENT',
      statement: 'Learn from feedback and refine the outcome.',
      description: 'The best products evolve through honest iteration. We measure user feedback, refine flows, and ensure your team is equipped for long-term independence.',
      icon: RefreshCw,
      highlight: 'Measured iteration',
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.principle-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-anthix" ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
            <span>WHY ANTHIX</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            Built around real-world needs.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            No jargon, no inflated promises. We operate on four foundational principles designed to deliver measurable progress.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="hidden lg:flex items-center justify-between mb-8 px-4">
          {principles.map((_, idx) => (
            <div key={idx} className="flex-1 flex items-center">
              <div 
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  activePrinciple === idx ? 'bg-primary ring-4 ring-primary/20 scale-125' : 'bg-border'
                }`} 
              />
              {idx < principles.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 transition-colors duration-300 ${
                    activePrinciple > idx ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 4 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activePrinciple === idx;

            return (
              <div
                key={item.number}
                onMouseEnter={() => setActivePrinciple(idx)}
                className={`principle-card p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isHovered
                    ? 'bg-background-alt border-primary/60 shadow-soft-md scale-[1.01]'
                    : 'bg-white border-border hover:border-border/80 shadow-soft-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-sm font-bold text-primary px-3 py-1 rounded-full bg-white border border-border">
                      {item.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isHovered ? 'bg-primary text-white shadow-soft-xs' : 'bg-background-lavender text-primary'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-text-main tracking-wide uppercase mb-2">
                    {item.title}
                  </h3>

                  <div className="text-xl font-bold text-primary-deep mb-4 leading-snug font-heading">
                    "{item.statement}"
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main font-sans">
                    {item.highlight}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-primary transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
