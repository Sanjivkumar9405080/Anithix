import { MessageSquareText, Compass, CheckCircle, Users } from 'lucide-react';

export const CollaborationSection = () => {
  const principles = [
    {
      title: 'Clear Communication',
      tagline: 'Transparent & Jargon-Free',
      description: 'We keep project goals, delivery expectations, technical trade-offs, and architectural decisions completely understandable for all stakeholders.',
      icon: MessageSquareText,
      accent: 'primary',
      deliverable: 'Weekly async updates & open project tracking',
    },
    {
      title: 'Shared Direction',
      tagline: 'Aligned on True Purpose',
      description: 'We align daily engineering with the core institutional challenge and intended real-world outcomes, ensuring we solve the right problems.',
      icon: Compass,
      accent: 'sky',
      deliverable: 'Clear milestone definitions & target criteria',
    },
    {
      title: 'Thoughtful Execution',
      tagline: 'Refinement at Every Stage',
      description: 'We make considered technical choices, validating each milestone with stakeholders and adapting thoughtfully as requirements mature.',
      icon: CheckCircle,
      accent: 'emerald',
      deliverable: 'Early prototypes & continuous feedback loops',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>BUILT TOGETHER</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            Better Solutions Start With <span className="gradient-text">Collaboration.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
            Good outcomes come from clear communication, shared understanding, and working together toward the same goal.
          </p>
        </div>

        {/* 3-Column Visual Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="group rounded-3xl bg-background-alt border border-border hover:border-primary/40 p-8 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent Top Border Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sky opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Icon & Tagline */}
                  <div className="w-14 h-14 rounded-2xl bg-white text-primary border border-border/80 shadow-soft-xs flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-text-main mb-1 group-hover:text-primary transition-colors">
                    {principle.title}
                  </h3>

                  <div className="text-xs font-semibold text-primary mb-4">
                    {principle.tagline}
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed font-sans mb-8">
                    {principle.description}
                  </p>
                </div>

                {/* Bottom Deliverable Ribbon */}
                <div className="pt-4 border-t border-border/80 flex items-center gap-2 text-xs font-mono text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{principle.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
