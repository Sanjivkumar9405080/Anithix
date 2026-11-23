import { useState } from 'react';
import { Hammer, Code, Cpu, Smartphone, ShieldCheck, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const BuildSection = () => {
  const [buildStep, setBuildStep] = useState<number>(3); // 0: Wireframe, 1: Layout, 2: Polish & Tokens, 3: Completed Production

  const highlights = [
    {
      title: 'Design & Development',
      tag: 'Craftsmanship',
      description: 'Bridging design systems with modern code (React, TypeScript, Tailwind) to ensure aesthetic elegance matches technical excellence.',
      icon: Code,
    },
    {
      title: 'Seamless Integration',
      tag: 'Ecosystem Sync',
      description: 'Connecting backends, database layers, AI services, and third-party APIs with resilient error boundaries and rate handling.',
      icon: Cpu,
    },
    {
      title: 'Testing & Refinement',
      tag: 'Quality Assurance',
      description: 'Rigorous cross-browser evaluation, accessibility compliance checks, and performance audits to guarantee frictionless UX.',
      icon: ShieldCheck,
    },
    {
      title: 'Responsive Experiences',
      tag: 'Adaptive UI',
      description: 'Ensuring fluid scaling and ergonomic interaction from 360px mobile screens up to multi-monitor 4K desktop environments.',
      icon: Smartphone,
    },
  ];

  return (
    <section id="step-build" className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Description & Build Highlights */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <Hammer className="w-3.5 h-3.5 text-primary" />
              <span>STEP 03 / BUILD</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Build With Purpose. <span className="gradient-text">Refine With Care.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
              We bring the plan to life through thoughtful development, testing, and iteration—focusing on usability, functionality, and the needs of the people who will use the solution.
            </p>

            {/* Highlights Grid */}
            <div className="space-y-4 w-full">
              {highlights.map((hl) => {
                const Icon = hl.icon;
                return (
                  <div
                    key={hl.title}
                    className="p-4 rounded-2xl bg-background-alt border border-border hover:border-primary/30 transition-all hover:shadow-soft-xs flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-background-lavender text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-sm text-text-main">
                          {hl.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-primary border border-border font-semibold">
                          {hl.tag}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed font-sans">
                        {hl.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Progressive UI Builder Interactive Visual */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-background-alt border border-border p-6 sm:p-8 shadow-soft-md space-y-6">
              {/* Interactive Step Switcher Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Interactive Evolution Canvas</span>
                  <h3 className="font-heading font-extrabold text-lg text-text-main">
                    Watch the Product Take Shape
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-border shadow-soft-xs">
                  {['1. Wireframe', '2. Structure', '3. Tokens', '4. Complete'].map((label, index) => (
                    <button
                      key={label}
                      onClick={() => setBuildStep(index)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        buildStep === index
                          ? 'bg-primary text-white shadow-soft-xs'
                          : 'text-text-secondary hover:text-text-main'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progressive Mockup Window */}
              <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-soft-sm transition-all duration-300">
                {/* Browser bar */}
                <div className="bg-background-alt px-4 py-3 border-b border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] font-mono text-text-secondary px-3 py-0.5 rounded-full bg-white border border-border">
                    {buildStep === 0 && 'stage-1: wireframe-scaffolding'}
                    {buildStep === 1 && 'stage-2: semantic-layout-tree'}
                    {buildStep === 2 && 'stage-3: brand-token-injection'}
                    {buildStep === 3 && 'stage-4: production-responsive-app'}
                  </div>
                  <div className="text-[10px] font-mono text-primary font-bold">
                    {buildStep === 3 ? '100% Ready' : `${(buildStep + 1) * 25}% Built`}
                  </div>
                </div>

                {/* Simulated Content Body based on buildStep */}
                <div className="p-6 min-h-[300px] flex flex-col justify-between transition-all duration-300">
                  {/* Stage 0: Wireframe */}
                  {buildStep === 0 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 font-mono">
                          [Card Skeleton]
                        </div>
                        <div className="h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 font-mono">
                          [Metric Placeholder]
                        </div>
                        <div className="h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 font-mono">
                          [Action Queue]
                        </div>
                      </div>
                      <div className="h-28 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 font-mono">
                        [Data Visualization Wireframe Area]
                      </div>
                    </div>
                  )}

                  {/* Stage 1: Structure */}
                  {buildStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-base text-gray-700">Operational Overview</h4>
                        <div className="px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-mono text-gray-600">Layout Hierarchy</div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-[11px] text-gray-500">Active Workflows</div>
                          <div className="text-xl font-bold text-gray-800">14</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-[11px] text-gray-500">Pipeline Health</div>
                          <div className="text-xl font-bold text-gray-800">99.8%</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-[11px] text-gray-500">Throughput</div>
                          <div className="text-xl font-bold text-gray-800">2.4k/m</div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 h-24 flex items-center justify-center text-xs text-gray-600">
                        Semantic grid assembled with accessible ARIA landmarks
                      </div>
                    </div>
                  )}

                  {/* Stage 2: Tokens & Styling */}
                  {buildStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-extrabold text-base text-text-main">Applied Design System</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-background-lavender text-primary text-[10px] font-bold">
                          Tokens: #635BFF & #38BDF8
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-primary/30 shadow-soft-xs">
                          <div className="text-[11px] text-text-secondary">Active Workflows</div>
                          <div className="text-xl font-heading font-extrabold text-primary">14</div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-sky/30 shadow-soft-xs">
                          <div className="text-[11px] text-text-secondary">Pipeline Health</div>
                          <div className="text-xl font-heading font-extrabold text-sky">99.98%</div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-primary-deep/30 shadow-soft-xs">
                          <div className="text-[11px] text-text-secondary">Throughput</div>
                          <div className="text-xl font-heading font-extrabold text-primary-deep">2.4k/m</div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-background-lavender/50 to-background-alt border border-primary/20 flex items-center justify-between text-xs text-text-main">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Sparkles className="w-4 h-4 text-primary" /> Manrope Typography & Micro-animations
                        </span>
                        <span className="text-[10px] font-mono text-primary font-bold">Applying Elevation</span>
                      </div>
                    </div>
                  )}

                  {/* Stage 3: Complete Production Concept */}
                  {buildStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase">Production Build</span>
                          <h4 className="font-heading font-extrabold text-lg text-text-main">ANTHIX Solution Engine</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-white border border-border shadow-soft-xs">
                          <div className="text-[11px] text-text-secondary">Audit Status</div>
                          <div className="text-xl font-heading font-extrabold text-text-main">Pass</div>
                          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% WCAG 2.1</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white border border-border shadow-soft-xs">
                          <div className="text-[11px] text-text-secondary">Speed Score</div>
                          <div className="text-xl font-heading font-extrabold text-primary">99/100</div>
                          <div className="text-[10px] text-primary font-semibold mt-0.5">Sub-50ms TTFB</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white border border-border shadow-soft-xs">
                          <div className="text-[11px] text-text-secondary">Scalability</div>
                          <div className="text-xl font-heading font-extrabold text-sky">High</div>
                          <div className="text-[10px] text-sky font-semibold mt-0.5">Edge CDN Ready</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-gradient-to-r from-background-alt via-white to-background-alt border border-border flex items-center justify-between text-xs text-text-main shadow-soft-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold">Fully Interactive Production Artifact</div>
                            <div className="text-[11px] text-text-secondary">Clean React + TypeScript implementation</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-primary font-bold hidden sm:inline">v1.0.0 Stable</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Illustrative Concept Disclaimer Note */}
              <p className="text-[11px] text-text-secondary/80 font-sans text-center sm:text-left">
                * Illustrative interface prototype designed to demonstrate ANTHIX progressive engineering standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
