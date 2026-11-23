import { Ear, Target, HelpCircle, Layers, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';

export const DiscoverSection = () => {
  const activities = [
    {
      title: 'Listen & Understand',
      tag: 'Qualitative Research',
      description: 'We learn about the core problem, user journeys, daily operational friction, and desired outcomes through structured discussions.',
      icon: Ear,
      color: 'primary',
    },
    {
      title: 'Explore the Challenge',
      tag: 'Constraint Mapping',
      description: 'We identify technical dependencies, existing infrastructure constraints, user accessibility needs, and untapped opportunities.',
      icon: HelpCircle,
      color: 'sky',
    },
    {
      title: 'Define the Goal',
      tag: 'Outcome Alignment',
      description: 'We establish a clear, documented consensus on what the final solution must accomplish, setting objective metrics for success.',
      icon: Target,
      color: 'emerald',
    },
  ];

  return (
    <section id="step-discover" className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Context & Core Activities */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>STEP 01 / DISCOVER</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Understand Before You <span className="gradient-text">Build.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
              We begin by understanding the people, challenges, and goals behind an idea. A clear understanding helps establish the right direction before work begins.
            </p>

            {/* 3 Activities List */}
            <div className="space-y-4 w-full">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.title}
                    className="p-5 rounded-2xl bg-background-alt border border-border hover:border-primary/30 transition-all hover:shadow-soft-xs"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background-lavender text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-bold text-base text-text-main">
                            {act.title}
                          </h3>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-text-secondary border border-border">
                            {act.tag}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Discovery Board */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-background-alt border border-border p-6 sm:p-8 shadow-soft-md overflow-hidden">
              {/* Header Ribbon */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-heading font-bold text-sm text-text-main">Discovery Canvas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Phase 01 Active</span>
                </div>
              </div>

              {/* Connected Requirement Cards Canvas */}
              <div className="relative min-h-[380px] flex flex-col justify-between space-y-4">
                {/* Connecting SVG Backdrop */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#635BFF" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="30%" y1="80%" x2="50%" y2="50%" stroke="#5145E5" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>

                {/* Top Row Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  {/* Card 1: User Friction */}
                  <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-soft-xs hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono mb-2">
                      <span className="text-primary font-bold">INSIGHT 01</span>
                      <UserCheck className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="font-heading font-bold text-sm text-text-main mb-1">Workflow Friction Points</div>
                    <p className="text-xs text-text-secondary">Manual data sync across disparate legacy databases creates daily 2-hour delays.</p>
                  </div>

                  {/* Card 2: Constraints */}
                  <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-soft-xs hover:border-sky/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono mb-2">
                      <span className="text-sky font-bold">INSIGHT 02</span>
                      <Layers className="w-3.5 h-3.5 text-sky" />
                    </div>
                    <div className="font-heading font-bold text-sm text-text-main mb-1">Architecture Constraints</div>
                    <p className="text-xs text-text-secondary">Must operate within existing institutional security protocols and OAuth providers.</p>
                  </div>
                </div>

                {/* Center Node: Discovery Nucleus */}
                <div className="mx-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-deep text-white shadow-soft-sm flex items-center gap-2 text-xs font-bold relative z-10">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>Synthesized Problem Statement</span>
                </div>

                {/* Bottom Row Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  {/* Card 3: Target Audiences */}
                  <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-soft-xs hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono mb-2">
                      <span className="text-primary-deep font-bold">DELIVERABLE 01</span>
                      <Target className="w-3.5 h-3.5 text-primary-deep" />
                    </div>
                    <div className="font-heading font-bold text-sm text-text-main mb-1">Audience Persona Matrix</div>
                    <p className="text-xs text-text-secondary">Primary operators require clean interfaces; technical leads require clear API contracts.</p>
                  </div>

                  {/* Card 4: Success Criteria */}
                  <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-soft-xs hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono mb-2">
                      <span className="text-emerald-600 font-bold">DELIVERABLE 02</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="font-heading font-bold text-sm text-text-main mb-1">Validated Success Metrics</div>
                    <p className="text-xs text-text-secondary">Zero regression risk, sub-100ms UI responsiveness, and measurable operational clarity.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Status Footer */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary font-mono">
                <span>Result: Documented Project Brief</span>
                <span className="text-emerald-600 font-bold font-sans">Ready for Step 02 / Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
