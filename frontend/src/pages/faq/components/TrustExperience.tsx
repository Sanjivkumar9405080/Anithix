import { useState } from 'react';
import { Ear, CheckCircle, RefreshCw, Layers, HeartHandshake, ChevronRight } from 'lucide-react';

export const TrustExperience = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      number: '01',
      title: 'Understood',
      summary: 'Your goals and challenges are heard.',
      tagline: 'Deep Listening & Problem Definition',
      description:
        'We begin by listening carefully to what you are trying to solve. Rather than pushing pre-packaged templates, we map your audience requirements, operational friction points, and real objectives.',
      icon: Ear,
      color: 'sky',
      highlights: ['Jargon-free discussions', 'Understanding constraints first', 'Clear requirement scoping'],
    },
    {
      id: 1,
      number: '02',
      title: 'Aligned',
      summary: 'The scope, expectations, and next steps become clearer.',
      tagline: 'Transparent Architecture & Roadmaps',
      description:
        'Before writing code, we develop a shared architectural blueprint. Milestones, technical dependencies, and delivery expectations are documented clearly so every stakeholder moves forward with confidence.',
      icon: CheckCircle,
      color: 'primary',
      highlights: ['Shared technical roadmap', 'Realistic phased milestones', 'Transparent project boundaries'],
    },
    {
      id: 2,
      number: '03',
      title: 'In Progress',
      summary: 'Work advances through communication and iteration.',
      tagline: 'Collaborative Build Sprints',
      description:
        'Development happens out in the open. You review functional prototypes, test working features early, and provide feedback as the system takes shape, preventing late surprises.',
      icon: Layers,
      color: 'primary-deep',
      highlights: ['Working prototype previews', 'Regular async check-ins', 'Continuous refinement'],
    },
    {
      id: 3,
      number: '04',
      title: 'Evolving',
      summary: 'Feedback helps inform future improvements.',
      tagline: 'Long-Term Partnership & Iteration',
      description:
        'A successful launch is just the beginning. We assess real-world usage patterns, identify opportunities for optimization, and guide ongoing enhancements as your organization expands.',
      icon: RefreshCw,
      color: 'emerald',
      highlights: ['Operational usage evaluation', 'Measured iterative upgrades', 'Ongoing knowledge transfer'],
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-primary" />
            <span>THE COLLABORATIVE EXPERIENCE</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            What Working With ANTHIX <span className="gradient-text">Should Feel Like.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
            Our collaborative journey is designed to remove uncertainty, foster open dialogue, and ensure technology genuinely serves your goals.
          </p>
        </div>

        {/* Interactive 4-Stage Step Bar */}
        <div className="rounded-3xl bg-background-alt border border-border p-6 sm:p-10 shadow-soft-sm">
          {/* Stage Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? 'bg-white border-primary shadow-soft-sm scale-[1.02]'
                      : 'bg-white/60 border-border hover:bg-white hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary text-white' : 'bg-background-alt text-text-secondary'
                    }`}>
                      {stage.number}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-background-lavender text-primary' : 'bg-background-alt text-text-secondary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-extrabold text-base text-text-main mb-0.5">
                      {stage.title}
                    </h3>
                    <p className="text-[11px] text-text-secondary line-clamp-1 font-sans">
                      {stage.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Card */}
          <div className="rounded-2xl bg-white border border-border p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-soft-xs">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-0.5 rounded-md bg-background-lavender">
                  STAGE {stages[activeStage].number}
                </span>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider font-mono">
                  {stages[activeStage].tagline}
                </span>
              </div>

              <h4 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main mb-3">
                {stages[activeStage].title}: {stages[activeStage].summary}
              </h4>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans mb-6">
                {stages[activeStage].description}
              </p>

              {/* Highlights checklist */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                {stages[activeStage].highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-text-main">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Stage Navigation CTA */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setActiveStage((prev) => (prev + 1) % 4)}
                className="px-5 py-2.5 rounded-xl bg-background-alt hover:bg-background-lavender border border-border text-xs font-semibold text-primary flex items-center gap-1.5 transition-colors shadow-soft-xs"
              >
                <span>Explore Next Stage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="mt-6 text-[11px] text-text-secondary font-sans text-center sm:text-left">
            * This journey represents the core ANTHIX collaboration philosophy. Individual project cadences are calibrated directly to your team&apos;s preferences.
          </div>
        </div>
      </div>
    </section>
  );
};
