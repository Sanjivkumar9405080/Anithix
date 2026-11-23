import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, Cpu, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const AboutPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      id: 1,
      name: 'IDEA',
      title: 'Real-world Understanding',
      icon: Lightbulb,
      description: 'Every great solution begins by identifying genuine friction points and defining the real outcome rather than chasing unnecessary complexity.',
      tags: ['Problem Discovery', 'Contextual Diagnosis', 'Clear Vision'],
      accent: 'from-amber-400 to-orange-500',
    },
    {
      id: 2,
      name: 'TECHNOLOGY',
      title: 'Purposeful Engineering',
      icon: Cpu,
      description: 'We craft the right technical vehicle—fast modern web applications, intelligent automation pipelines, or hands-on team training.',
      tags: ['Modern Architecture', 'Workflow Automation', 'Scalable Code'],
      accent: 'from-primary to-sky-400',
    },
    {
      id: 3,
      name: 'IMPACT',
      title: 'Measurable Progress',
      icon: Target,
      description: 'Technology is only valuable when it produces tangible outcomes: saved hours, elevated student skills, and smooth operations.',
      tags: ['Reliable Delivery', 'Empowered Teams', 'Ongoing Refinement'],
      accent: 'from-sky-400 to-emerald-400',
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

      const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
      cards.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 35 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power2.out',
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt relative overflow-hidden border-t border-border"
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-background-lavender/60 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-border shadow-soft-sm">
            <span>THE ANTHIX APPROACH</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            Technology should move you forward.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            We believe technology should do more than look impressive. It should solve real problems, simplify everyday work, and create meaningful opportunities for growth.
          </p>
        </div>

        {/* Visual Progression: IDEA → TECHNOLOGY → IMPACT */}
        <div className="relative mb-16">
          <div className="hidden lg:block absolute top-[74px] left-[15%] right-[15%] h-1 pointer-events-none -z-0">
            <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none">
              <path
                d="M 0,20 Q 300,-8 600,20 T 1200,20"
                fill="none"
                stroke="#E8EAF2"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              <path
                ref={pathRef}
                d="M 0,20 Q 300,-8 600,20 T 1200,20"
                fill="none"
                stroke="url(#gradient-flow)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#635BFF" />
                  <stop offset="50%" stopColor="#8B7CFF" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.id;
              const cardRef = idx === 0 ? card1Ref : idx === 1 ? card2Ref : card3Ref;

              return (
                <div
                  key={step.id}
                  ref={cardRef}
                  onClick={() => setActiveStep(step.id)}
                  className={`cursor-pointer rounded-2xl p-7 transition-all duration-300 relative border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-primary shadow-soft-lg scale-[1.02]'
                      : 'bg-white/95 hover:bg-white border-border hover:border-primary/40 shadow-soft-sm hover:shadow-soft-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-heading font-extrabold text-xs tracking-widest text-primary px-3 py-1 rounded-full bg-background-lavender">
                        0{step.id} — {step.name}
                      </span>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr ${step.accent} text-white shadow-soft-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-text-main mb-3">
                      {step.title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/80">
                    <div className="flex flex-wrap gap-1.5">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-secondary bg-background-alt px-2.5 py-1 rounded-md"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div 
                      className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full bg-gradient-to-r from-primary via-[#8B7CFF] to-sky-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-background-lavender flex items-center justify-center shrink-0 text-primary">
              <span className="font-bold text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-text-main">
                Targeted for organizations seeking clarity and execution
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary font-sans">
                From fast-moving startups and business owners to schools, colleges, and healthcare institutions.
              </p>
            </div>
          </div>
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep shrink-0 group font-sans"
          >
            <span>Explore our services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
