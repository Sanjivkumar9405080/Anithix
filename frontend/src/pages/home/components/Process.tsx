import { useState } from 'react';
import { Search, Compass, Hammer, Sparkles, ArrowRight } from 'lucide-react';

export const Process = () => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const steps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'Understand the goals, audience, and problem.',
      details: 'We begin with an in-depth conversation to understand your institutional context, user audience, pain points, and target timeline.',
      deliverables: ['Stakeholder alignment', 'User requirement definition', 'Feasibility assessment'],
      icon: Search,
    },
    {
      number: '02',
      title: 'PLAN',
      subtitle: 'Define the requirements and approach.',
      details: 'We structure the technical roadmap, architectural choices, interface wireframes, and curriculum outlines before any coding starts.',
      deliverables: ['System specification', 'UX/UI wireframes', 'Milestone timetable'],
      icon: Compass,
    },
    {
      number: '03',
      title: 'BUILD',
      subtitle: 'Develop the agreed solution with attention to usability and quality.',
      details: 'Active development through agile milestones. Clean, commented code, tested workflows, and regular preview touchpoints for stakeholders.',
      deliverables: ['Functional software / automation', 'Interactive courseware', 'Documentation'],
      icon: Hammer,
    },
    {
      number: '04',
      title: 'IMPROVE',
      subtitle: 'Review feedback and identify opportunities for refinement.',
      details: 'Deployment is the beginning of real-world learning. We review performance feedback, optimize user journeys, and support your team.',
      deliverables: ['User feedback synthesis', 'Performance calibration', 'Ongoing handover support'],
      icon: Sparkles,
    },
  ];

  return (
    <section id="approach" className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-border shadow-soft-sm">
            <span>OUR APPROACH</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            From the first idea to the next step.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            A transparent, four-phase path designed to eliminate ambiguity and keep projects on track.
          </p>
        </div>

        {/* Desktop Step Navigators */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-8">
          {steps.map((step, idx) => {
            const isActive = selectedStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setSelectedStep(idx)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 relative ${
                  isActive
                    ? 'bg-white border-primary shadow-soft-md'
                    : 'bg-white/60 hover:bg-white border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-sm font-bold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    STEP {step.number}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-border'}`} />
                </div>
                <div className="font-heading font-bold text-base text-text-main">
                  {step.title}
                </div>
                <div className="text-xs text-text-secondary mt-1 line-clamp-1 font-sans">
                  {step.subtitle}
                </div>
                {isActive && (
                  <div className="absolute -bottom-px left-6 right-6 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Highlight Card */}
        <div className="hidden lg:block bg-white rounded-3xl p-8 lg:p-10 border border-border shadow-soft-sm mb-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary text-xs font-bold uppercase mb-4 font-sans">
                <span>Phase {steps[selectedStep].number} in Detail</span>
              </div>
              <h3 className="font-heading font-extrabold text-3xl text-text-main mb-3">
                {steps[selectedStep].title}
              </h3>
              <p className="text-lg font-semibold text-primary mb-4 font-sans">
                {steps[selectedStep].subtitle}
              </p>
              <p className="text-base text-text-secondary leading-relaxed mb-6 font-sans">
                {steps[selectedStep].details}
              </p>
              
              <div className="pt-6 border-t border-border">
                <div className="text-xs font-bold uppercase text-text-secondary tracking-wider mb-3 font-heading">
                  Key Outcomes & Deliverables:
                </div>
                <div className="flex flex-wrap gap-2">
                  {steps[selectedStep].deliverables.map((del) => (
                    <span
                      key={del}
                      className="px-3 py-1.5 rounded-lg bg-background-alt border border-border text-xs font-medium text-text-main font-sans"
                    >
                      ✓ {del}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-5 bg-background-alt rounded-2xl p-8 border border-border flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white flex items-center justify-center shadow-soft-md mb-6">
                {(() => {
                  const Icon = steps[selectedStep].icon;
                  return <Icon className="w-10 h-10" />;
                })()}
              </div>
              <div className="text-sm font-bold text-text-main font-heading">Structured Execution</div>
              <div className="text-xs text-text-secondary mt-1 font-sans">
                Phase {steps[selectedStep].number} of 04
              </div>
              <div className="flex items-center gap-1.5 mt-4">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === selectedStep ? 'w-8 bg-primary' : 'w-2 bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 border border-border shadow-soft-sm relative pl-14"
              >
                <div className="absolute top-6 left-4 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs font-mono shadow-soft-xs">
                  {step.number}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-text-main">
                    {step.title}
                  </h3>
                </div>

                <div className="text-sm font-semibold text-primary mb-2 font-sans">
                  {step.subtitle}
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 font-sans">
                  {step.details}
                </p>

                <div className="pt-3 border-t border-border flex flex-wrap gap-1.5">
                  {step.deliverables.map((del) => (
                    <span
                      key={del}
                      className="px-2.5 py-1 rounded bg-background-alt text-[11px] font-medium text-text-main border border-border font-sans"
                    >
                      ✓ {del}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep group font-sans"
          >
            <span>Have a project to discuss? Start with Step 01</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
