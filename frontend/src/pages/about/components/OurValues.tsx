import { Sparkles, Lightbulb, Target, RefreshCw, Users, ArrowUpRight } from 'lucide-react';

export const OurValues = () => {
  const values = [
    {
      number: '01',
      title: 'Innovation',
      statement: 'We explore better ways to solve meaningful problems.',
      description: 'True innovation is not about adding complexity; it is about finding cleaner, faster, and more reliable methods to overcome real challenges.',
      icon: Lightbulb,
      color: 'from-amber-400 to-orange-500',
    },
    {
      number: '02',
      title: 'Purpose',
      statement: 'We focus on outcomes that provide real value.',
      description: 'Every project must serve a clear purpose. We measure success by tangible results, saved time, elevated capability, and institutional satisfaction.',
      icon: Target,
      color: 'from-primary to-primary-deep',
    },
    {
      number: '03',
      title: 'Continuous Learning',
      statement: 'We embrace curiosity, improvement, and evolving technology.',
      description: 'The technological landscape changes constantly. We continually sharpen our own toolsets and share actionable knowledge with the teams we instruct.',
      icon: RefreshCw,
      color: 'from-sky-400 to-blue-600',
    },
    {
      number: '04',
      title: 'Collaboration',
      statement: 'We believe better solutions emerge when people work together.',
      description: 'We partner closely with founders, directors, administrators, and students to build solutions that fit naturally into their daily realities.',
      icon: Users,
      color: 'from-purple-500 to-primary',
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt border-t border-border relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-border shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>OUR CORE VALUES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            What Drives Us.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            These four principles guide every line of code we write, every curriculum we deliver, and every client relationship we foster.
          </p>
        </div>

        {/* 4 Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="group p-8 rounded-3xl bg-white border border-border hover:border-primary/40 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-background-lavender">
                      {val.number}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-background-lavender to-background-softBlue flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-text-main mb-2">
                    {val.title}
                  </h3>

                  <div className="text-base font-bold text-primary-deep mb-4 leading-snug font-heading">
                    "{val.statement}"
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed font-sans">
                    {val.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-xs text-text-secondary font-sans font-medium">
                  <span>ANTHIX Principle {val.number}</span>
                  <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
