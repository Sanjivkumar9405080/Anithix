import { HelpCircle, Lightbulb, Compass, Hammer } from 'lucide-react';

export const WorkingPrinciples = () => {
  const concepts = [
    {
      step: '01',
      title: 'Understand the Need',
      summary: 'Problem-First Perspective',
      description: 'Start with the challenge, the people involved, and the outcome being pursued.',
      icon: Lightbulb,
      details: 'We begin by diagnosing the root issue rather than prescribing technology prematurely.',
      color: 'sky',
    },
    {
      step: '02',
      title: 'Choose With Purpose',
      summary: 'Pragmatic Tool Selection',
      description: 'Explore suitable technologies and avoid complexity that does not serve the objective.',
      icon: Compass,
      details: 'We select frameworks and architectures that offer long-term maintainability, not temporary hype.',
      color: 'primary',
    },
    {
      step: '03',
      title: 'Build With Intention',
      summary: 'Focused Engineering',
      description: 'Focus on usability, clear requirements, and opportunities for refinement.',
      icon: Hammer,
      details: 'Every line of code and UI component is tested against real user needs and operational performance.',
      color: 'emerald',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt/50 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>WHAT MAKES OUR APPROACH DIFFERENT</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            The Right Solution Starts With <span className="gradient-text">the Right Questions.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
            We avoid generic templates and unnecessary bloat by focusing on fundamental questions that guide purposeful technology choices.
          </p>
        </div>

        {/* 3 Connected Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {concepts.map((concept) => {
            const Icon = concept.icon;
            return (
              <div
                key={concept.step}
                className="group rounded-3xl bg-white border border-border hover:border-primary/40 p-8 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent Top Border Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sky opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Step and Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender">
                      STEP {concept.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-background-alt text-primary group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-soft-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-text-main mb-1.5 group-hover:text-primary transition-colors">
                    {concept.title}
                  </h3>

                  <div className="text-xs font-semibold text-primary mb-4 font-mono">
                    {concept.summary}
                  </div>

                  <p className="text-sm text-text-main font-medium leading-relaxed font-sans mb-3">
                    &ldquo;{concept.description}&rdquo;
                  </p>

                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    {concept.details}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-text-secondary">
                  <span>Guiding Pillar</span>
                  <span className="text-primary font-bold">Purposeful</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
