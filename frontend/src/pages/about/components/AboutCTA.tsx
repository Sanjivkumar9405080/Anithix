import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const AboutCTA = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-background-lavender relative overflow-hidden border-t border-border">
      {/* Restrained animated violet-blue ambient visual */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[950px] h-[380px] sm:h-[480px] bg-gradient-to-r from-primary/15 via-sky-400/15 to-primary/10 rounded-[120px] blur-3xl pointer-events-none transform -rotate-3"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full border border-primary/20 animate-pulse pointer-events-none"
        style={{ animationDuration: '4s' }}
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full border border-sky-400/20 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>START THE CONVERSATION</span>
        </div>

        <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-text-main tracking-tight leading-[1.1] mb-6">
          Have an Idea in <span className="gradient-text">Mind?</span>
        </h2>

        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 font-normal font-sans">
          Let's explore how technology can turn your next idea into something meaningful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact">
            <Button
              size="lg"
              icon={<ArrowRight className="w-5 h-5 ml-1" />}
              className="px-9 py-4 shadow-soft-lg hover:shadow-glow-primary"
            >
              Start a Conversation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
