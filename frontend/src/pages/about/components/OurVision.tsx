import { Compass, TrendingUp, Layers, Zap, ArrowUpRight } from 'lucide-react';

export const OurVision = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-white border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-sm self-start">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>OUR VISION</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Empowering the Next Generation of <span className="gradient-text">Digital Builders.</span>
            </h2>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-sans mb-8">
              "To help create a future where businesses, educational institutions, and organizations can use technology confidently to solve meaningful problems, unlock opportunities, and create lasting impact."
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background-alt border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main font-heading">Confidence Over Intimidation</h4>
                  <p className="text-xs text-text-secondary mt-0.5 font-sans">
                    Demystifying modern software, AI architectures, and cloud tools so organizations feel in control.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background-alt border border-border">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main font-heading">Institutional Readiness</h4>
                  <p className="text-xs text-text-secondary mt-0.5 font-sans">
                    Equipping colleges and schools with cutting-edge curricula and tools directly mapped to tech employment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual of Growth & Connectivity */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-background-lavender/70 via-white to-background-softBlue/60 rounded-3xl p-8 border border-border shadow-soft-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  Future Horizon
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                  Forward Trajectory
                </span>
              </div>

              {/* Graphic Flow of Trajectory */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-border shadow-soft-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-text-main font-heading">Accessible Intelligence</div>
                    <div className="text-[11px] text-text-secondary font-sans">AI serving everyday human workflows</div>
                  </div>
                  <Zap className="w-4 h-4 text-primary" />
                </div>

                <div className="p-4 rounded-2xl bg-white border border-border shadow-soft-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-text-main font-heading">Practical Education</div>
                    <div className="text-[11px] text-text-secondary font-sans">Real-world coding for immediate capability</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sky-500" />
                </div>

                <div className="p-4 rounded-2xl bg-white border border-border shadow-soft-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-text-main font-heading">Scalable Ecosystems</div>
                    <div className="text-[11px] text-text-secondary font-sans">Clean architectures designed to outlast fads</div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/80 text-center">
                <span className="text-xs font-bold text-text-main font-heading">
                  ANTHIX · Purposeful Tech Evolution
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
