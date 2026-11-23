import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, BrainCircuit, Hammer, RefreshCcw } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const OurApproach = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'Understand the problem, goals, and requirements.',
      description: 'We listen carefully to uncover the fundamental operational challenges, target audience expectations, and desired metrics before discussing solutions.',
      details: ['User research & empathy mapping', 'Stakeholder alignment meetings', 'Feasibility & timeline definition'],
      icon: Search,
    },
    {
      number: '02',
      title: 'THINK',
      subtitle: 'Explore possibilities and plan a practical solution.',
      description: 'We evaluate architectural approaches, design intuitive user flows, and formulate a clear technical blueprint focused on performance and maintainability.',
      details: ['System architecture specification', 'Interactive UX wireframing', 'Technology stack selection'],
      icon: BrainCircuit,
    },
    {
      number: '03',
      title: 'BUILD',
      subtitle: 'Develop, test, and refine the solution.',
      description: 'Agile sprints with clean, documented code and hands-on testing. We provide regular demo checkpoints so stakeholders retain complete visibility.',
      details: ['Modular frontend & backend engineering', 'Automated testing & optimization', 'Thorough accessibility audits'],
      icon: Hammer,
    },
    {
      number: '04',
      title: 'EVOLVE',
      subtitle: 'Learn from results and identify improvements.',
      description: 'Deployment is the beginning of continuous refinement. We gather real-world telemetry, review user feedback, and help teams iterate with confidence.',
      details: ['Feedback synthesis & telemetry', 'Performance fine-tuning', 'Team training & smooth handover'],
      icon: RefreshCcw,
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (pathRef.current && sectionRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(pathRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center 45%',
            scrub: 1.2,
          },
          strokeDashoffset: 0,
          ease: 'none',
        });
      }

      gsap.from('.approach-card', {
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
    <section ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-8 bg-white border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
            <span>METHODOLOGY</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            From Ideas to <span className="gradient-text">Impact.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            A disciplined four-step execution framework engineered to eliminate ambiguity and deliver measurable progress.
          </p>
        </div>

        {/* Desktop Progress Bar / Tab Selector */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-8">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 relative ${
                  isActive
                    ? 'bg-background-alt border-primary shadow-soft-sm'
                    : 'bg-white hover:bg-background-alt border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    PHASE {step.number}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-border'}`} />
                </div>
                <div className="font-heading font-bold text-base text-text-main">
                  {step.title}
                </div>
                <div className="text-xs text-text-secondary mt-1 line-clamp-1 font-sans">
                  {step.subtitle}
                </div>
                {isActive && (
                  <div className="absolute -bottom-px left-6 right-6 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Active Step Focus Card (Desktop) */}
        <div className="hidden lg:block bg-background-alt rounded-3xl p-8 lg:p-10 border border-border shadow-soft-sm mb-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-7">
              <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-white border border-border inline-block mb-4">
                Step {steps[activeStep].number} · Detailed Roadmap
              </span>
              <h3 className="font-heading font-extrabold text-3xl text-text-main mb-3">
                {steps[activeStep].title}
              </h3>
              <p className="text-lg font-semibold text-primary mb-4 font-sans">
                {steps[activeStep].subtitle}
              </p>
              <p className="text-base text-text-secondary leading-relaxed mb-6 font-sans">
                {steps[activeStep].description}
              </p>
              
              <div className="pt-6 border-t border-border">
                <div className="text-xs font-bold uppercase text-text-secondary tracking-wider mb-3 font-heading">
                  Milestones & Quality Deliverables:
                </div>
                <div className="flex flex-wrap gap-2">
                  {steps[activeStep].details.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-medium text-text-main font-sans"
                    >
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-5 bg-white rounded-2xl p-8 border border-border flex flex-col items-center justify-center text-center shadow-soft-xs">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white flex items-center justify-center shadow-soft-md mb-6">
                {(() => {
                  const Icon = steps[activeStep].icon;
                  return <Icon className="w-10 h-10" />;
                })()}
              </div>
              <div className="text-sm font-bold text-text-main font-heading">Phase {steps[activeStep].number} of 04</div>
              <div className="text-xs text-text-secondary mt-1 font-sans">
                Structured & Measurable Execution
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-background-alt rounded-2xl p-6 border border-border shadow-soft-sm relative pl-14"
              >
                <div className="absolute top-6 left-4 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs font-mono shadow-soft-xs">
                  {step.number}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-text-main">
                    {step.title}
                  </h3>
                </div>

                <div className="text-sm font-semibold text-primary mb-2 font-sans">
                  {step.subtitle}
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 font-sans">
                  {step.description}
                </p>

                <div className="pt-3 border-t border-border flex flex-wrap gap-1.5">
                  {step.details.map((d) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-text-main border border-border font-sans"
                    >
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
