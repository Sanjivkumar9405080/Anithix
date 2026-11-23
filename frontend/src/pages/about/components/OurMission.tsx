import { Target, CheckCircle2 } from 'lucide-react';

export const OurMission = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-background-lavender/50 border-t border-border relative overflow-hidden">
      {/* Ambient background light aura */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-primary/10 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm">
          <Target className="w-3.5 h-3.5 text-primary" />
          <span>OUR MISSION</span>
        </div>

        {/* Heading */}
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-8">
          Making Technology <span className="gradient-text">Genuinely Impactful.</span>
        </h2>

        {/* Mission Statement Callout Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-primary/20 shadow-soft-lg text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none" />

          <p className="text-xl sm:text-2xl md:text-3xl text-text-main font-heading font-bold leading-relaxed mb-8">
            "To make technology more useful, accessible, and impactful by building thoughtful digital solutions, applying AI and automation where they add value, and enabling people to grow through practical technical learning."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border font-sans">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-text-main font-heading">Thoughtful Solutions</h4>
                <p className="text-xs text-text-secondary mt-1">Carefully architected for performance, stability, and human usability.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-text-main font-heading">Value-First Automation</h4>
                <p className="text-xs text-text-secondary mt-1">Applying artificial intelligence only where it directly saves time and friction.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-text-main font-heading">Empowering Growth</h4>
                <p className="text-xs text-text-secondary mt-1">Training students and enterprise teams with hands-on, production-ready skills.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
