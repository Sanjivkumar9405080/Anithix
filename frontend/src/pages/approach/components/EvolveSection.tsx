import { useState } from 'react';
import { TrendingUp, MessageSquare, LineChart, Lightbulb, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const EvolveSection = () => {
  const [activeCycleIndex, setActiveCycleIndex] = useState<number>(0);

  const cycleNodes = [
    {
      title: 'Gather Feedback',
      phase: '01 / INPUT',
      description: 'Listening directly to users, monitoring behavior flows, and capturing real-world usage observations.',
      icon: MessageSquare,
      color: 'sky',
    },
    {
      title: 'Review Performance',
      phase: '02 / EVALUATION',
      description: 'Analyzing latency, error rates, interaction bottlenecks, and system uptime under live operational workloads.',
      icon: LineChart,
      color: 'primary',
    },
    {
      title: 'Identify Opportunities',
      phase: '03 / STRATEGY',
      description: 'Pinpointing emerging requirements, workflow refinements, and intelligent automations that add practical value.',
      icon: Lightbulb,
      color: 'primary-deep',
    },
    {
      title: 'Improve Iteratively',
      phase: '04 / EXECUTION',
      description: 'Rolling out measured, tested updates without service disruptions or regression issues.',
      icon: RefreshCw,
      color: 'emerald',
    },
  ];

  return (
    <section id="step-evolve" className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Context */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>STEP 04 / EVOLVE</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Good Solutions Keep <span className="gradient-text">Getting Better.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
              Building a solution is not always the end of the journey. Feedback, changing needs, and new opportunities can help guide future improvements.
            </p>

            {/* 4 Pillars Accordion/Cards */}
            <div className="space-y-3.5 w-full">
              {cycleNodes.map((item, index) => {
                const Icon = item.icon;
                const isSelected = activeCycleIndex === index;
                return (
                  <button
                    key={item.title}
                    onClick={() => setActiveCycleIndex(index)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-white border-primary shadow-soft-xs'
                        : 'bg-white/60 border-border hover:bg-white hover:border-border/80'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-primary text-white shadow-soft-xs' : 'bg-background-lavender text-primary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-sm text-text-main">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-alt text-primary font-bold">
                          {item.phase}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Circular Feedback-Loop Interactive Visualization */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-white border border-border p-6 sm:p-10 shadow-soft-md overflow-hidden flex flex-col items-center justify-center">
              {/* Header Ribbon */}
              <div className="w-full flex items-center justify-between pb-6 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-heading font-bold text-sm text-text-main">The Continuous Improvement Loop</span>
                </div>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Continuous Cycle
                </span>
              </div>

              {/* Circular Graphic Container */}
              <div className="relative w-full max-w-[420px] aspect-square my-6 flex items-center justify-center">
                {/* SVG Loop Ring */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <circle
                    cx="200"
                    cy="200"
                    r="140"
                    fill="none"
                    stroke="#E8EAF2"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="140"
                    fill="none"
                    stroke="#635BFF"
                    strokeWidth="3"
                    strokeDasharray="40 180"
                    strokeDashoffset="20"
                    className="animate-spin"
                    style={{ animationDuration: '24s' }}
                  />
                </svg>

                {/* Central Nucleus Badge: LEARN -> IMPROVE -> GROW */}
                <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-background-lavender via-white to-background-softBlue border-2 border-primary/20 shadow-soft-sm flex flex-col items-center justify-center text-center p-4 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mb-2 animate-ping" />
                  <div className="font-mono text-[10px] tracking-wider text-primary font-bold uppercase">Continuous Loop</div>
                  <div className="font-heading font-extrabold text-sm text-text-main leading-tight my-1">
                    LEARN → IMPROVE → GROW
                  </div>
                  <div className="text-[10px] text-text-secondary">Measured outcomes</div>
                </div>

                {/* 4 Orbiting Loop Nodes */}
                {/* Top Node: Gather Feedback */}
                <button
                  onClick={() => setActiveCycleIndex(0)}
                  className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 shadow-soft-xs ${
                    activeCycleIndex === 0
                      ? 'bg-primary text-white border-primary scale-105'
                      : 'bg-white text-text-main border-border hover:border-primary/40'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-sans">01 Feedback</span>
                </button>

                {/* Right Node: Review Performance */}
                <button
                  onClick={() => setActiveCycleIndex(1)}
                  className={`absolute top-1/2 right-0 -translate-y-1/2 z-20 px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 shadow-soft-xs ${
                    activeCycleIndex === 1
                      ? 'bg-primary text-white border-primary scale-105'
                      : 'bg-white text-text-main border-border hover:border-primary/40'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-sans">02 Performance</span>
                </button>

                {/* Bottom Node: Identify Opportunities */}
                <button
                  onClick={() => setActiveCycleIndex(2)}
                  className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 shadow-soft-xs ${
                    activeCycleIndex === 2
                      ? 'bg-primary text-white border-primary scale-105'
                      : 'bg-white text-text-main border-border hover:border-primary/40'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-sans">03 Opportunities</span>
                </button>

                {/* Left Node: Improve Iteratively */}
                <button
                  onClick={() => setActiveCycleIndex(3)}
                  className={`absolute top-1/2 left-0 -translate-y-1/2 z-20 px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 shadow-soft-xs ${
                    activeCycleIndex === 3
                      ? 'bg-primary text-white border-primary scale-105'
                      : 'bg-white text-text-main border-border hover:border-primary/40'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-sans">04 Iteration</span>
                </button>
              </div>

              {/* Active Node Detail Card */}
              <div className="w-full mt-4 p-4 rounded-2xl bg-background-alt border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-text-main font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Selected Phase: {cycleNodes[activeCycleIndex].title}</span>
                </div>
                <span className="font-mono text-primary font-bold">{cycleNodes[activeCycleIndex].phase}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
