import { Globe, Bot, GraduationCap, ArrowDownRight, Check, Code, Network, LayoutTemplate, Layers } from 'lucide-react';

export const ServiceOverview = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services-overview" className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt/50 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
            <span>OUR EXPERTISE</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            Three Ways We Create <span className="gradient-text">Impact.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans font-normal">
            We combine technology, intelligent systems, and practical knowledge to help turn ideas into solutions.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Digital Solutions */}
          <div className="group rounded-3xl bg-white border border-border hover:border-primary/40 p-8 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender border border-primary/10">
                  PILLAR 01
                </span>
                <div className="w-12 h-12 rounded-2xl bg-sky/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-2xl text-text-main mb-3 group-hover:text-primary transition-colors">
                Digital Solutions
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                Modern digital experiences designed to solve real problems, simplify interactions, and help organizations move forward.
              </p>

              {/* Visual Preview: Floating browser mockup */}
              <div className="mb-6 p-4 rounded-2xl bg-background-alt border border-border/80 group-hover:border-primary/20 transition-all">
                <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-border/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-[10px] text-text-secondary/80 font-mono">anthix.dev/interface</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-main font-semibold bg-white p-2 rounded-lg border border-border/60 shadow-soft-xs">
                    <span className="flex items-center gap-1.5">
                      <LayoutTemplate className="w-3.5 h-3.5 text-primary" /> Responsive App
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold">Optimized</span>
                  </div>
                  <div className="h-1.5 w-4/5 bg-primary/20 rounded-full" />
                  <div className="h-1.5 w-3/5 bg-sky/30 rounded-full" />
                </div>
              </div>

              {/* Service Capabilities List */}
              <div className="space-y-2.5 mb-8">
                {[
                  'Website Development',
                  'Web Applications',
                  'UI/UX Design',
                  'Digital Experiences',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs font-medium text-text-main">
                    <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Action CTA */}
            <button
              onClick={() => scrollToSection('digital-solutions')}
              className="w-full pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-primary hover:text-primary-deep group-hover:translate-x-0.5 transition-all text-left"
            >
              <span>Explore Digital Solutions</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Card 2: AI & Automation */}
          <div className="group rounded-3xl bg-white border border-border hover:border-primary/40 p-8 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-deep opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender border border-primary/10">
                  PILLAR 02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-2xl text-text-main mb-3 group-hover:text-primary transition-colors">
                AI & Automation
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                Practical AI and automation solutions that help streamline repetitive work, improve workflows, and unlock new possibilities.
              </p>

              {/* Visual Preview: Neural node network mockup */}
              <div className="mb-6 p-4 rounded-2xl bg-background-alt border border-border/80 group-hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between text-[10px] text-text-secondary/80 font-mono mb-3 pb-2 border-b border-border/60">
                  <span>pipeline.ai/orchestrator</span>
                  <span className="text-primary font-bold">Active Flow</span>
                </div>
                <div className="flex items-center justify-between gap-1 py-1">
                  <div className="px-2 py-1 bg-white border border-border rounded text-[10px] font-semibold text-text-main shadow-soft-xs">Input</div>
                  <div className="h-0.5 w-6 bg-gradient-to-r from-border to-primary" />
                  <div className="px-2 py-1 bg-primary text-white rounded text-[10px] font-semibold shadow-soft-xs flex items-center gap-1">
                    <Network className="w-2.5 h-2.5" /> AI Engine
                  </div>
                  <div className="h-0.5 w-6 bg-gradient-to-r from-primary to-emerald-500" />
                  <div className="px-2 py-1 bg-white border border-border rounded text-[10px] font-semibold text-text-main shadow-soft-xs">Output</div>
                </div>
              </div>

              {/* Service Capabilities List */}
              <div className="space-y-2.5 mb-8">
                {[
                  'AI-Powered Solutions',
                  'Workflow Automation',
                  'Intelligent Assistants',
                  'Process Optimization',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs font-medium text-text-main">
                    <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Action CTA */}
            <button
              onClick={() => scrollToSection('ai-automation')}
              className="w-full pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-primary hover:text-primary-deep group-hover:translate-x-0.5 transition-all text-left"
            >
              <span>Explore AI & Automation</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Card 3: Technical Training */}
          <div className="group rounded-3xl bg-white border border-border hover:border-primary/40 p-8 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sky opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender border border-primary/10">
                  PILLAR 03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-2xl text-text-main mb-3 group-hover:text-primary transition-colors">
                Technical Training
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                Practical, engaging technical learning designed to build skills, strengthen understanding, and prepare people for evolving technology.
              </p>

              {/* Visual Preview: Code snippet & progress card */}
              <div className="mb-6 p-4 rounded-2xl bg-background-alt border border-border/80 group-hover:border-primary/20 transition-all font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-text-secondary/80 mb-2 pb-2 border-b border-border/60">
                  <span className="flex items-center gap-1">
                    <Code className="w-3 h-3 text-emerald-600" /> workshop.module.ts
                  </span>
                  <span className="text-emerald-600 font-bold">Hands-On</span>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed bg-white p-2.5 rounded-lg border border-border/60">
                  <span className="text-primary font-bold">const</span> sprint = buildSkill(&#123;
                  <br />
                  &nbsp;&nbsp;focus: <span className="text-sky">&apos;production-ready&apos;</span>
                  <br />
                  &#125;);
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-text-secondary">
                  <span className="flex items-center gap-1 font-sans font-medium">
                    <Layers className="w-3 h-3 text-primary" /> 3 Applied Modules
                  </span>
                  <span className="font-bold text-primary font-sans">100% Practical</span>
                </div>
              </div>

              {/* Service Capabilities List */}
              <div className="space-y-2.5 mb-8">
                {[
                  'Technical Workshops',
                  'AI & Technology Education',
                  'Hands-on Learning',
                  'Skill Development',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs font-medium text-text-main">
                    <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Action CTA */}
            <button
              onClick={() => scrollToSection('technical-training')}
              className="w-full pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-primary hover:text-primary-deep group-hover:translate-x-0.5 transition-all text-left"
            >
              <span>Explore Technical Training</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
