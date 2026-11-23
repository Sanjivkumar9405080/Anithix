import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Cpu, Sparkles, Workflow, ArrowRightCircle, Database, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const AIAndAutomation = () => {
  const [activeNode, setActiveNode] = useState<number>(1); // 0: Input, 1: AI Processing, 2: Automation, 3: Output

  const workflowNodes = [
    {
      id: 0,
      step: '01',
      title: 'Input Layer',
      subtitle: 'Data Sources & Triggers',
      icon: Database,
      tag: 'Raw Data Ingestion',
      description: 'Structured inputs from webhooks, document uploads, system APIs, or manual submissions enter a validated ingestion pipeline.',
      metrics: 'REST & GraphQL · JSON / CSV · Event-driven',
      color: 'sky',
    },
    {
      id: 1,
      step: '02',
      title: 'AI Processing',
      subtitle: 'Reasoning & Context Core',
      icon: Cpu,
      tag: 'Targeted Intelligence',
      description: 'Language models and reasoning heuristics parse context, extract critical entities, classify intent, and synthesize action requirements.',
      metrics: 'Context Evaluation · Entity Extraction · Intent Classification',
      color: 'primary',
    },
    {
      id: 2,
      step: '03',
      title: 'Automation',
      subtitle: 'Pipeline Orchestration',
      icon: Workflow,
      tag: 'Deterministic Execution',
      description: 'Rule-bounded multi-step workflows route data, trigger approvals, update internal records, and coordinate third-party integrations.',
      metrics: 'Error Recovery · Idempotent Queues · Human-in-the-Loop',
      color: 'primary-deep',
    },
    {
      id: 3,
      step: '04',
      title: 'Output Layer',
      subtitle: 'Synchronized Actions',
      icon: ArrowRightCircle,
      tag: 'Verified Delivery',
      description: 'Formatted artifacts, actionable notifications, updated dashboards, or automated client responses are delivered to their destination.',
      metrics: 'Zero Bottlenecks · Real-time Audit Logs · Verified Results',
      color: 'emerald',
    },
  ];

  const capabilities = [
    {
      title: 'AI-Powered Applications',
      desc: 'Purpose-built smart interfaces that assist users with context-aware recommendations, search, and data synthesis.',
    },
    {
      title: 'Workflow Automation',
      desc: 'Seamless automation pipelines that bridge disparate tools, sync databases, and eliminate redundant manual steps.',
    },
    {
      title: 'Intelligent Assistants',
      desc: 'Custom-configured digital assistants that provide immediate support, document discovery, and operational answers.',
    },
    {
      title: 'Process Optimization',
      desc: 'Systematic auditing and refactoring of internal operational bottlenecks for enhanced organizational efficiency.',
    },
    {
      title: 'AI Integration Consulting',
      desc: 'Pragmatic technical advisory on safely adopting AI frameworks without unnecessary overhead or security compromises.',
    },
  ];

  return (
    <section id="ai-automation" className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>02 / AI & AUTOMATION</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            Make Complex Work Feel <span className="gradient-text">Simple.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
            Explore how AI and automation can reduce repetitive tasks, connect workflows, and help teams work more efficiently.
          </p>

          <Link to="/contact">
            <Button size="lg" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Discuss an AI Solution
            </Button>
          </Link>
        </div>

        {/* Interactive Workflow Diagram Component */}
        <div className="rounded-3xl bg-white border border-border p-6 sm:p-10 shadow-soft-md mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Interactive Pipeline Architecture</span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-text-main mt-1">
                From Ingestion to Verified Outcome
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Click any node to inspect data flow</span>
            </div>
          </div>

          {/* 4 Interactive Nodes Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {workflowNodes.map((node) => {
              const Icon = node.icon;
              const isSelected = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-background-lavender/50 border-primary shadow-soft-sm scale-[1.02]'
                      : 'bg-background-alt/60 border-border hover:border-primary/40 hover:bg-white'
                  }`}
                >
                  {/* Top indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-border'
                    }`}>
                      {node.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary text-white shadow-soft-xs'
                        : 'bg-white text-primary border border-border'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-text-main mb-1">
                      {node.title}
                    </h4>
                    <p className="text-xs text-text-secondary mb-3">
                      {node.subtitle}
                    </p>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-border text-primary inline-block">
                      {node.tag}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-primary/20 flex items-center justify-between text-[11px] font-semibold text-primary">
                      <span>Currently Active</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Node Inspector Panel */}
          <div className="rounded-2xl bg-gradient-to-r from-background-alt via-white to-background-alt border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-primary text-white font-mono text-xs font-bold">
                  STEP {workflowNodes[activeNode].step}
                </span>
                <span className="text-sm font-bold text-text-main">
                  {workflowNodes[activeNode].title} Details
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">
                {workflowNodes[activeNode].description}
              </p>
              <div className="text-xs font-mono text-primary-deep font-semibold flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Protocol: {workflowNodes[activeNode].metrics}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveNode((prev) => (prev + 1) % 4)}
                className="px-4 py-2 rounded-xl bg-white border border-border hover:border-primary/40 text-xs font-semibold text-text-main flex items-center gap-1.5 shadow-soft-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                <span>Next Stage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlighted AI Capabilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.title}
              className="p-6 rounded-3xl bg-white border border-border hover:border-primary/30 transition-all hover:shadow-soft-xs"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-background-lavender text-primary flex items-center justify-center shrink-0 text-xs font-mono font-bold">
                  0{idx + 1}
                </div>
                <h4 className="font-heading font-bold text-lg text-text-main">
                  {cap.title}
                </h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">
                {cap.desc}
              </p>
            </div>
          ))}

          {/* Principle Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-background-lavender to-white border border-primary/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                <Bot className="w-4 h-4" />
                <span>Our AI Philosophy</span>
              </div>
              <h4 className="font-heading font-bold text-lg text-text-main mb-2">
                Practical, Safe & Human-Centric
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                We believe in deterministic automation where AI assists and accelerates operations safely, rather than black-box systems with unpredictable behaviors.
              </p>
            </div>
            <div className="pt-4 border-t border-primary/10 text-[11px] font-semibold text-primary">
              Deterministic Logic · Audit Trails · Scalable
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
