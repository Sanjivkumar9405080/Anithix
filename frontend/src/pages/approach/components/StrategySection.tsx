import { Compass, GitBranch, Layers, CheckSquare, Calendar, ChevronRight, ShieldCheck, Cpu } from 'lucide-react';

export const StrategySection = () => {
  const planningPillars = [
    {
      title: 'Solution Exploration',
      tag: 'Architectural Options',
      description: 'We evaluate multiple technical and interface approaches to determine which solution delivers maximum reliability with minimal complexity.',
      icon: GitBranch,
    },
    {
      title: 'Technical Planning',
      tag: 'System Design',
      description: 'We blueprint components, data schemas, API contracts, and integration layers to ensure rock-solid stability before writing production code.',
      icon: Cpu,
    },
    {
      title: 'Scope Definition',
      tag: 'Boundary Mapping',
      description: 'We establish unambiguous project boundaries, identifying high-impact must-haves versus future nice-to-haves.',
      icon: Layers,
    },
    {
      title: 'Prioritization',
      tag: 'Phased Milestones',
      description: 'We sequence development into pragmatic sprints that provide early prototypes and rapid feedback loops.',
      icon: CheckSquare,
    },
  ];

  return (
    <section id="step-plan" className="py-20 lg:py-28 px-4 sm:px-8 bg-background-lavender/30 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Description & Pillars */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>STEP 02 / PLAN</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Turn Understanding Into <span className="gradient-text">Direction.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
              With the challenge clearly defined, we explore possible approaches and create a practical plan for moving forward.
            </p>

            {/* 4 Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {planningPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all hover:shadow-soft-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-background-lavender text-primary flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-heading font-bold text-sm text-text-main mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed font-sans">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/60 text-[10px] font-mono font-semibold text-primary">
                      {pillar.tag}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Modern Planning Board & Roadmap Visualization */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-white border border-border p-6 sm:p-8 shadow-soft-md space-y-6">
              {/* Header Ribbon */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Strategic Blueprint</span>
                  <h3 className="font-heading font-extrabold text-xl text-text-main mt-0.5">
                    Architecture & Milestone Roadmap
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-mono font-bold border border-primary/20">
                  Ready for Sprinting
                </span>
              </div>

              {/* Central Strategy Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-background-alt via-white to-background-alt border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-soft-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-main">Deterministic Architecture Standard</div>
                    <div className="text-xs text-text-secondary">Modular, accessible, maintainable code with strict type safety</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Verified Blueprint
                </span>
              </div>

              {/* Roadmap Timeline Modules */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Iterative Execution Sequence</span>
                </div>

                {/* Milestone 1 */}
                <div className="p-4 rounded-2xl bg-background-alt border border-border/80 hover:border-primary/30 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-white border border-border font-mono text-xs font-bold flex items-center justify-center text-primary">
                      01
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text-main">Phase 1: Architecture & UI Prototype</h4>
                      <p className="text-xs text-text-secondary">Component architecture, design tokens, and clickable user flow wireframes.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 hidden sm:block" />
                </div>

                {/* Milestone 2 */}
                <div className="p-4 rounded-2xl bg-background-alt border border-border/80 hover:border-primary/30 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-white border border-border font-mono text-xs font-bold flex items-center justify-center text-primary">
                      02
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text-main">Phase 2: Core Engineering & Integrations</h4>
                      <p className="text-xs text-text-secondary">API bindings, business logic orchestration, database connections, and security checks.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 hidden sm:block" />
                </div>

                {/* Milestone 3 */}
                <div className="p-4 rounded-2xl bg-background-alt border border-border/80 hover:border-primary/30 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-white border border-border font-mono text-xs font-bold flex items-center justify-center text-primary">
                      03
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text-main">Phase 3: Testing, Refinement & Rollout</h4>
                      <p className="text-xs text-text-secondary">Performance auditing, responsive testing, edge-case hardening, and deployment.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 hidden sm:block" />
                </div>
              </div>

              {/* Disclaimer Note */}
              <p className="text-[11px] text-text-secondary/80 pt-2 font-sans text-center sm:text-left">
                * Illustrative representation of ANTHIX strategic planning. Timelines and phases are customized to the specific scale of each project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
