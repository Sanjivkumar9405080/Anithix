import { Search, Compass, Hammer, TrendingUp, Sparkles, Target, Network, CheckCircle, Repeat } from 'lucide-react';

export const ServicesProcess = () => {
  const processSteps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Understand the Context',
      description: 'We listen carefully to understand your underlying problem, audience, operational environment, and core objectives.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Plan',
      tagline: 'Architect the Path',
      description: 'We identify pragmatic opportunities and outline a structured, clear technical approach tailored to your specific timeline.',
      icon: Compass,
    },
    {
      number: '03',
      title: 'Build',
      tagline: 'Craft & Refine',
      description: 'We engineer, test, and rigorously refine the proposed solution using modern frameworks and production standards.',
      icon: Hammer,
    },
    {
      number: '04',
      title: 'Improve',
      tagline: 'Evaluate & Iterate',
      description: 'We review practical operational feedback, monitor outcomes, and identify measured opportunities for continuous enhancement.',
      icon: TrendingUp,
    },
  ];

  const whyAnthixFeatures = [
    {
      title: 'Purpose-Driven',
      description: 'We focus on addressing genuine organizational needs rather than introducing unnecessary technical complexity or decorative hype.',
      icon: Target,
      accent: 'primary',
    },
    {
      title: 'Connected Thinking',
      description: 'We bridge digital interfaces, artificial intelligence, automated pipelines, and human learning into a unified ecosystem.',
      icon: Network,
      accent: 'sky',
    },
    {
      title: 'Practical Execution',
      description: 'We prioritize functional, battle-tested solutions with clean architecture and maintainable code over fragile prototypes.',
      icon: CheckCircle,
      accent: 'emerald',
    },
    {
      title: 'Continuous Improvement',
      description: 'We treat feedback and measured iteration as essential components of our long-term partnership with businesses.',
      icon: Repeat,
      accent: 'primary-deep',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt/60 border-t border-border">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* ================= Part 1: How We Work ================= */}
        <div>
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>OUR APPROACH</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
              From Challenge to <span className="gradient-text">Solution.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
              Our structured process ensures transparent communication, rapid feedback loops, and solutions engineered to last.
            </p>
          </div>

          {/* Desktop & Mobile Timeline Container */}
          <div className="relative">
            {/* Desktop Connecting SVG Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-8 h-1 z-0 px-12 pointer-events-none">
              <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                <line
                  x1="5%"
                  y1="50%"
                  x2="95%"
                  y2="50%"
                  stroke="#E8EAF2"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <line
                  x1="5%"
                  y1="50%"
                  x2="95%"
                  y2="50%"
                  stroke="#635BFF"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  strokeDashoffset="12"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Steps Grid: 4 Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="group rounded-3xl bg-white border border-border hover:border-primary/40 p-6 sm:p-7 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Step Number & Icon Header */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender border border-primary/10">
                          PHASE {step.number}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-background-alt text-primary group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-soft-xs">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="font-heading font-extrabold text-2xl text-text-main mb-1">
                        {step.title}
                      </h3>

                      <div className="text-xs font-semibold text-primary mb-3">
                        {step.tagline}
                      </div>

                      <p className="text-sm text-text-secondary leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-secondary">
                      <span>Milestone {step.number}</span>
                      <span className="text-primary font-bold">Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= Part 2: Why ANTHIX? ================= */}
        <div className="pt-12 border-t border-border">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <span>WHY ANTHIX</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
              Thoughtful Technology. <span className="gradient-text">Meaningful Outcomes.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
              We operate at the intersection of modern design, computational intelligence, and practical execution.
            </p>
          </div>

          {/* 4 Feature Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAnthixFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl bg-white border border-border p-7 hover:border-primary/40 hover:shadow-soft-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mb-6 shadow-soft-xs">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="font-heading font-extrabold text-xl text-text-main mb-3">
                      {feat.title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed font-sans">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/80 flex items-center gap-2 text-[11px] font-semibold text-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Core Discipline</span>
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
