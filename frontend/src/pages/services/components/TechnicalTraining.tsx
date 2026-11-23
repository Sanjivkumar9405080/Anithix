import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Code2, Terminal, CheckCircle2, BookOpen, Layers, Laptop, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const TechnicalTraining = () => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'ai' | 'automation'>('frontend');

  const codeSnippets = {
    frontend: `// Modern Web Architecture Workshop
import { createEngine } from '@anthix/core';

export async function initStudentApp() {
  const engine = await createEngine({
    runtime: 'client-edge',
    framework: 'React 18 + TypeScript',
    optimizations: ['code-splitting', 'zero-cls']
  });

  return engine.deploy({ environment: 'production' });
}`,
    ai: `// Applied AI & Agent Workflows Module
import { IntelligentAgent, ContextMemory } from '@anthix/ai';

const assistant = new IntelligentAgent({
  model: 'curated-reasoning',
  memory: new ContextMemory({ windowSize: 10 }),
  guardrails: { strictJsonOutput: true }
});

const result = await assistant.processStream(userQuery);`,
    automation: `// Workflow Orchestration Sprint
import { definePipeline, triggerStep } from '@anthix/automate';

export const syncWorkflow = definePipeline({
  trigger: 'webhook:payload_received',
  steps: [
    triggerStep('validatePayload'),
    triggerStep('enrichWithAI'),
    triggerStep('syncToDatabase')
  ]
});`,
  };

  const trainingPillars = [
    {
      title: 'AI & Automation Fundamentals',
      desc: 'Demystifying modern machine learning, prompt engineering, agentic patterns, and practical API integration.',
      icon: Sparkles,
    },
    {
      title: 'Modern Web Engineering',
      desc: 'Hands-on instruction in React, TypeScript, state architectures, and building production-grade user interfaces.',
      icon: Code2,
    },
    {
      title: 'Technical Workshops & Bootcamps',
      desc: 'Intensive, interactive sprints structured for colleges, universities, and enterprise developer teams.',
      icon: Laptop,
    },
    {
      title: 'Hands-on Real-World Projects',
      desc: 'Learning by doing — participants build actual applications rather than following purely theoretical exercises.',
      icon: Layers,
    },
    {
      title: 'Technology Skill Development',
      desc: 'Mentorship on modern tooling, git collaboration workflows, debugging strategies, and architectural thinking.',
      icon: BookOpen,
    },
  ];

  return (
    <section id="technical-training" className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Value Proposition & Offerings */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>03 / TECHNICAL TRAINING</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Learn Skills. Build Confidence. <span className="gradient-text">Create Possibilities.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
              We believe technology becomes more powerful when people understand how to use it. Our training approach emphasizes practical learning, experimentation, and real-world problem-solving.
            </p>

            {/* Core Training Focus Areas */}
            <div className="space-y-3.5 w-full mb-10">
              {trainingPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-2xl bg-background-alt border border-border hover:border-primary/30 transition-all flex items-start gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-background-lavender text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-text-main">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed font-sans">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link to="/contact">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                Discuss Training Requirements
              </Button>
            </Link>
          </div>

          {/* Right Column: Code Editor & Learning Dashboard Visual */}
          <div className="lg:col-span-6 space-y-6">
            {/* Interactive Code Editor Component */}
            <div className="rounded-3xl bg-[#1E1E2E] text-white border border-border/40 shadow-soft-lg overflow-hidden font-mono text-xs">
              {/* Editor Tabs Chrome */}
              <div className="bg-[#181825] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-white/40 text-[11px] hidden sm:inline">anthix-training-sandbox</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('frontend')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-colors ${
                      activeTab === 'frontend' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    WebDev.tsx
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-colors ${
                      activeTab === 'ai' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    AIModels.ts
                  </button>
                  <button
                    onClick={() => setActiveTab('automation')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-colors ${
                      activeTab === 'automation' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Automate.ts
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-5 overflow-x-auto text-[12px] leading-relaxed text-purple-200">
                <pre>
                  <code>{codeSnippets[activeTab]}</code>
                </pre>
              </div>

              {/* Terminal Footer */}
              <div className="bg-[#14141F] px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Ready:</span>
                  <span>Workshop environment active</span>
                </div>
                <span className="text-white/40 font-mono">UTF-8 · React 18</span>
              </div>
            </div>

            {/* Learning Roadmap & Hands-on Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-background-alt border border-border">
                <div className="text-[11px] font-semibold text-primary uppercase mb-1">Methodology</div>
                <div className="font-heading font-extrabold text-lg text-text-main">Hands-on Sprints</div>
                <p className="text-xs text-text-secondary mt-1">Direct building, not rote memorization.</p>
              </div>

              <div className="p-4 rounded-2xl bg-background-alt border border-border">
                <div className="text-[11px] font-semibold text-emerald-600 uppercase mb-1">Architecture</div>
                <div className="font-heading font-extrabold text-lg text-text-main">Real Tooling</div>
                <p className="text-xs text-text-secondary mt-1">React, TypeScript, APIs & CI/CD.</p>
              </div>

              <div className="p-4 rounded-2xl bg-background-alt border border-border">
                <div className="text-[11px] font-semibold text-sky uppercase mb-1">Format</div>
                <div className="font-heading font-extrabold text-lg text-text-main">Tailored Pace</div>
                <p className="text-xs text-text-secondary mt-1">Calibrated to institution needs.</p>
              </div>
            </div>

            {/* Curriculum Progress Highlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-background-lavender/60 via-white to-background-lavender/60 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-text-main">Active Curriculum Sprint</div>
                  <div className="text-[11px] text-text-secondary">Building end-to-end cloud applications</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-primary">Module 03 / 03</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Production Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
