import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe, Bot, GraduationCap, Compass } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const ApproachCTA = () => {
  const applicationAreas = [
    {
      title: 'Digital Solutions',
      icon: Globe,
      color: 'sky',
      description: 'Applying user discovery and iterative UI engineering to build performant, accessible websites and custom web applications.',
      points: ['Discovery-led interface design', 'Component-driven frontend architecture', 'Zero-bloat performance optimization'],
    },
    {
      title: 'AI & Automation',
      icon: Bot,
      color: 'primary',
      description: 'Mapping organizational bottlenecks, designing deterministic logic pipelines, and connecting systems safely with AI assistance.',
      points: ['Friction-point workflow mapping', 'Deterministic orchestration logic', 'Auditable, reliable execution'],
    },
    {
      title: 'Technical Training',
      icon: GraduationCap,
      color: 'emerald',
      description: 'Structuring hands-on educational bootcamps and engineering workshops centered around practical, production-ready building.',
      points: ['Real-world coding curriculum', 'Project-based skill verification', 'Active mentorship & problem solving'],
    },
  ];

  return (
    <div className="border-t border-border">
      {/* ================= Part 1: Our Approach Across Different Needs ================= */}
      <section className="py-20 lg:py-28 px-4 sm:px-8 bg-background-alt/50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>APPLIED PRINCIPLES</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
              One Mindset. <span className="gradient-text">Different Possibilities.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
              Our structured approach translates seamlessly across all three of our core offerings, ensuring consistent quality regardless of the challenge.
            </p>
          </div>

          {/* 3 Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {applicationAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="rounded-3xl bg-white border border-border p-8 shadow-soft-sm hover:shadow-soft-md hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mb-6 shadow-soft-xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-heading font-extrabold text-2xl text-text-main mb-3">
                      {area.title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed font-sans mb-6">
                      {area.description}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-border">
                      {area.points.map((pt) => (
                        <div key={pt} className="flex items-center gap-2 text-xs font-medium text-text-main">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/services" className="mt-8 pt-4 border-t border-border/80 block">
                    <span className="text-xs font-semibold text-primary hover:text-primary-deep flex items-center gap-1">
                      Explore {area.title} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Part 2: Final Closing CTA ================= */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-background-lavender/30 to-background-lavender/60 border-t border-border">
        {/* Soft Ambient Radial Light */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-primary/10 via-sky/10 to-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Abstract Orbit SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-20 -z-10 flex items-center justify-center">
          <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
            <circle cx="350" cy="350" r="300" stroke="#635BFF" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="350" cy="350" r="210" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="350" cy="350" r="130" stroke="#5145E5" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>START A PROJECT</span>
          </div>

          {/* Heading */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-main tracking-tight leading-[1.12] mb-6">
            Ready to Turn Your Idea Into <span className="gradient-text">Impact?</span>
          </h2>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10 font-normal font-sans">
            Whether you&apos;re developing a new digital product, automating operational workflows, or looking for practical technical training, we&apos;re here to help you get started.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                icon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="w-full sm:w-auto shadow-soft-md"
              >
                Start a Conversation
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                icon={<Compass className="w-4 h-4 ml-1 text-primary" />}
                className="w-full sm:w-auto bg-white hover:bg-background-alt"
              >
                Explore Our Services
              </Button>
            </Link>
          </div>

          {/* Core Commitments Footer */}
          <div className="mt-12 pt-8 border-t border-border/80 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary font-medium">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Collaborative Scoping
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Clear Architecture
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky" /> Measured Outcomes
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
