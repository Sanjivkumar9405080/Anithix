import { Shield, Target, Scale, MessageSquareCode } from 'lucide-react';

export const TransparencySection = () => {
  const statements = [
    {
      title: 'Clear Scope',
      headline: 'Unambiguous Boundaries',
      description: 'Understand the expected deliverables and important project boundaries before implementation.',
      icon: Target,
      color: 'sky',
    },
    {
      title: 'Realistic Possibilities',
      headline: 'Pragmatic Feasibility',
      description: 'Discuss feasibility, constraints, dependencies, and appropriate alternatives.',
      icon: Scale,
      color: 'primary',
    },
    {
      title: 'Open Communication',
      headline: 'Transparent Dialogue',
      description: 'Raise questions, review decisions, and clarify changes as the work progresses.',
      icon: MessageSquareCode,
      color: 'emerald',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-8 bg-gradient-to-b from-white via-background-lavender/30 to-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>A PRINCIPLE WE BELIEVE IN</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            Honest Expectations. <span className="gradient-text">Thoughtful Decisions.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
            Good partnerships depend on understanding what is possible, what requires exploration, and what needs to be agreed upon before work begins.
          </p>
        </div>

        {/* Animated Transparency Diagram & Cards */}
        <div className="relative rounded-3xl bg-white border border-border p-6 sm:p-12 shadow-soft-md overflow-hidden">
          {/* Central Connecting SVG Paths */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#635BFF" strokeWidth="2.5" strokeDasharray="6 6" />
              <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 6" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {statements.map((stmt, idx) => {
              const Icon = stmt.icon;
              return (
                <div
                  key={stmt.title}
                  className="rounded-3xl bg-background-alt border border-border hover:border-primary/40 p-8 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Circle Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center text-primary shadow-soft-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-2xl text-text-main mb-1.5">
                      {stmt.title}
                    </h3>

                    <div className="text-xs font-semibold text-primary mb-3.5">
                      {stmt.headline}
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed font-sans">
                      {stmt.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/80 flex items-center gap-2 text-xs font-mono text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Clarity Guarantee</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Ribbon Label: CLARITY BUILDS CONFIDENCE */}
          <div className="mt-12 pt-8 border-t border-border flex items-center justify-center">
            <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-background-lavender via-white to-background-lavender border border-primary/20 text-xs sm:text-sm font-heading font-extrabold text-primary shadow-soft-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>CLARITY BUILDS CONFIDENCE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
