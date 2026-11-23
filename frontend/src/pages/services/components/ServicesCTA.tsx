import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const ServicesCTA = () => {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-background-lavender/30 to-background-lavender/60 border-t border-border">
      {/* Background Soft Glow & Grid Pattern */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-primary/10 via-sky/10 to-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative Subtle Geometric SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20 -z-10 flex items-center justify-center">
        <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
          <circle cx="350" cy="350" r="300" stroke="#635BFF" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="350" cy="350" r="220" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="350" cy="350" r="140" stroke="#5145E5" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>START COLLABORATING</span>
        </div>

        {/* Heading */}
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-main tracking-tight leading-[1.12] mb-6">
          Let&apos;s Turn Your Next Idea Into <span className="gradient-text">Impact.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10 font-normal font-sans">
          Tell us what you&apos;re working on, what challenge you&apos;re facing, or what you&apos;d like to build. Let&apos;s explore the possibilities together.
        </p>

        {/* Action Buttons */}
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
          <Link to="/about" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              icon={<Compass className="w-4 h-4 ml-1 text-primary" />}
              className="w-full sm:w-auto bg-white hover:bg-background-alt"
            >
              Learn About ANTHIX
            </Button>
          </Link>
        </div>

        {/* Trust & Commitment Badge */}
        <div className="mt-12 pt-8 border-t border-border/80 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Transparent Scoping
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> Production Quality
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky" /> Continuous Collaboration
          </span>
        </div>
      </div>
    </section>
  );
};
