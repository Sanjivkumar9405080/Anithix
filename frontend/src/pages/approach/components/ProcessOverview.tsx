import { Search, Compass, Hammer, TrendingUp, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export const ProcessOverview = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Understand the Challenge',
      description: 'Understand the challenge, goals, audience, and requirements before writing a single line of code.',
      icon: Search,
      targetId: 'step-discover',
      color: 'sky',
    },
    {
      number: '02',
      title: 'Plan',
      tagline: 'Architect the Strategy',
      description: 'Explore opportunities, evaluate architecture, and define a practical, realistic roadmap.',
      icon: Compass,
      targetId: 'step-plan',
      color: 'primary',
    },
    {
      number: '03',
      title: 'Build',
      tagline: 'Craft the Solution',
      description: 'Develop, test, and refine a solution around identified needs with precision and purpose.',
      icon: Hammer,
      targetId: 'step-build',
      color: 'primary-deep',
    },
    {
      number: '04',
      title: 'Evolve',
      tagline: 'Iterate & Improve',
      description: 'Review operational feedback, learn from results, and identify measured opportunities for growth.',
      icon: TrendingUp,
      targetId: 'step-evolve',
      color: 'emerald',
    },
  ];

  const scrollToStep = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="process-overview" className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt/50 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
            <span>HOW WE WORK</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            A Clear Path From Idea to <span className="gradient-text">Impact.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans font-normal">
            We follow a structured four-stage methodology that turns ambiguous ideas into resilient, production-ready technology.
          </p>
        </div>

        {/* Desktop Connecting SVG Line */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-12 h-1 z-0 px-16 pointer-events-none">
            <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
              <line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="#E8EAF2"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              <line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="#635BFF"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeDashoffset="12"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* 4 Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  onClick={() => scrollToStep(step.targetId)}
                  className="group cursor-pointer rounded-3xl bg-white border border-border hover:border-primary/40 p-6 sm:p-7 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Accent Top Border Highlight on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sky opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Header: Stage Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender border border-primary/10">
                        STAGE {step.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-background-alt text-primary group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-soft-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-heading font-extrabold text-2xl text-text-main mb-1 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>

                    <div className="text-xs font-semibold text-primary mb-3">
                      {step.tagline}
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed font-sans mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Card Footer: Clickable Action Cue */}
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-deep transition-colors">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Inspect {step.title}
                    </span>
                    <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
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
