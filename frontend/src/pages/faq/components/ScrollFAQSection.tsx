import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MoveRight,
} from 'lucide-react';
import { scrollFaqItems } from '../data/scrollFaqData';
import { FAQVisualizer } from './FAQVisualizer';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ScrollFAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progressRatio, setProgressRatio] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const prefersReducedMotion = useReducedMotion();

  const totalSteps = scrollFaqItems.length;

  // Viewport resize detection
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // GSAP ScrollTrigger Pinned & Scrub-based Horizontal Storytelling Timeline for Desktop
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !sectionRef.current || !pinnedRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'horizontal-faq-scroll-trigger',
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinnedRef.current,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setProgressRatio(p);
            const idx = Math.min(Math.floor(p * totalSteps), totalSteps - 1);
            setActiveIndex(idx);
          },
        },
      });

      // Horizontal slide and answer reveal for each question
      for (let i = 0; i < totalSteps - 1; i++) {
        // Hold card i in view for user to comfortably read
        tl.to({}, { duration: 1.0 });

        // Coordinated Horizontal Transition:
        // Current card i slides out to the left
        tl.to(
          `#faq-card-${i}`,
          {
            x: -80,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            pointerEvents: 'none',
          }
        )
        // Next card i+1 slides in from the right
        .fromTo(
          `#faq-card-${i + 1}`,
          {
            x: 80,
            opacity: 0,
            pointerEvents: 'none',
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power2.inOut',
            pointerEvents: 'auto',
          },
          '<'
        )
        // Next card's answer reveals with refined vertical and opacity transition
        .fromTo(
          `#faq-answer-${i + 1}`,
          {
            y: 18,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '<0.1'
        );
      }

      // Hold final card at the end of the scroll sequence
      tl.to({}, { duration: 1.0 });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isDesktop, prefersReducedMotion, totalSteps]);

  // Jump to specific question on click
  const jumpToQuestion = (index: number) => {
    if (isDesktop && !prefersReducedMotion) {
      const st = ScrollTrigger.getById('horizontal-faq-scroll-trigger');
      if (st) {
        const targetProgress = (index + 0.45) / totalSteps;
        const targetScroll = st.start + targetProgress * (st.end - st.start);
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
        return;
      }
    }
    setActiveIndex(index);
    setProgressRatio((index + 0.5) / totalSteps);
  };

  const handleNext = () => {
    if (activeIndex < totalSteps - 1) {
      jumpToQuestion(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      jumpToQuestion(activeIndex - 1);
    }
  };

  const activeItem = useMemo(() => {
    return scrollFaqItems[activeIndex] || scrollFaqItems[0];
  }, [activeIndex]);

  return (
    <section
      id="faq-horizontal"
      ref={sectionRef}
      className={`relative w-full bg-white ${
        isDesktop && !prefersReducedMotion ? 'min-h-[420vh]' : 'py-12 sm:py-20'
      }`}
    >
      {/* =========================================================================
          DESKTOP PINNED VIEWPORT: HORIZONTAL STORYTELLING
          ========================================================================= */}
      {isDesktop && !prefersReducedMotion ? (
        <div
          ref={pinnedRef}
          className="w-full h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-16 overflow-hidden bg-white relative z-20"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-gradient-to-r from-background-lavender/40 via-background-softBlue/30 to-background-lavender/40 rounded-full blur-3xl -z-10 pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* ----------------------------------------------------
                LEFT PANEL: Label, Heading, Description & Progress
                ---------------------------------------------------- */}
            <div className="col-span-5 flex flex-col justify-between py-4">
              <div>
                {/* Small Label: 09 / FAQ */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-mono font-bold tracking-wider uppercase mb-5 border border-primary/20 shadow-soft-xs">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>09 / FAQ</span>
                </div>

                {/* Large Heading */}
                <h2 className="font-heading font-extrabold text-3xl xl:text-4xl 2xl:text-5xl text-text-main tracking-tight leading-[1.12] mb-4">
                  Common <br />
                  <span className="gradient-text">Questions.</span>
                </h2>

                {/* Supporting Text */}
                <p className="text-sm xl:text-base text-text-secondary leading-relaxed font-sans max-w-sm mb-6 font-normal">
                  Everything you need to know before starting a conversation with ANTHIX.
                </p>

                {/* Subtle Animated Violet-Blue Accent Line */}
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary via-[#8B7CFF] to-sky mb-6" />
              </div>

              {/* Vertical Interactive Progress Tracker */}
              <div className="relative pl-5 border-l-2 border-border/80 my-2">
                {/* Dynamic Sliding Violet Progress Line */}
                <div
                  className="absolute left-[-2px] top-0 w-[2px] bg-gradient-to-b from-primary via-[#8B7CFF] to-sky transition-all duration-300"
                  style={{
                    height: `${((activeIndex + 0.5) / totalSteps) * 100}%`,
                  }}
                />

                <div className="space-y-1.5">
                  {scrollFaqItems.map((item, idx) => {
                    const isActive = activeIndex === idx;
                    const isPassed = activeIndex > idx;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => jumpToQuestion(idx)}
                        className={`group flex items-center gap-3 text-left w-full transition-all duration-200 py-1 rounded-lg px-2 -ml-2 cursor-pointer ${
                          isActive
                            ? 'text-primary font-bold bg-background-lavender/40 translate-x-1'
                            : isPassed
                            ? 'text-text-main font-medium hover:text-primary hover:bg-background-alt/50'
                            : 'text-text-secondary hover:text-text-main font-normal'
                        }`}
                        aria-label={`Jump to question ${item.number}: ${item.shortTitle}`}
                      >
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded transition-all shrink-0 ${
                            isActive
                              ? 'bg-primary text-white font-bold shadow-soft-xs'
                              : isPassed
                              ? 'bg-primary/10 text-primary-deep font-semibold'
                              : 'bg-background-alt text-text-secondary group-hover:bg-background-lavender/60'
                          }`}
                        >
                          {item.number}
                        </span>
                        <span className="text-xs xl:text-sm font-sans line-clamp-1">
                          {item.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Progress Metrics & Directional Hints */}
              <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-28 h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-electric transition-all duration-150 ease-out"
                      style={{ width: `${Math.round(progressRatio * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-text-main">
                    {activeIndex + 1} / {totalSteps}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-text-secondary">
                  <MoveRight className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span className="font-medium">
                    {activeIndex === totalSteps - 1
                      ? 'Scroll to complete'
                      : 'Horizontal scroll story'}
                  </span>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                RIGHT PANEL: Horizontal Question Presentation Stage
                ---------------------------------------------------- */}
            <div className="col-span-7 flex flex-col justify-center relative">
              {/* Header Info Bar: Category + Step Counter + Arrow Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
                  <span>STEP {activeItem.number} — {activeItem.category}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-text-secondary bg-background-alt px-3 py-1 rounded-md border border-border">
                    {activeItem.number} OF 0{totalSteps}
                  </span>

                  {/* Directional Arrow Jump Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={activeIndex === 0}
                      className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous question"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={activeIndex === totalSteps - 1}
                      className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Next question"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Card Stage Area (Cards transition horizontally) */}
              <div className="relative w-full min-h-[380px] xl:min-h-[400px] overflow-hidden rounded-3xl">
                {scrollFaqItems.map((item, idx) => {
                  return (
                    <div
                      key={item.id}
                      id={`faq-card-${idx}`}
                      className="absolute inset-0 w-full bg-white/95 backdrop-blur-md rounded-3xl p-7 xl:p-9 border border-border shadow-[0_20px_50px_rgba(99,91,255,0.06)] flex flex-col justify-between overflow-hidden"
                      style={{
                        opacity: idx === 0 ? 1 : 0,
                        transform: idx === 0 ? 'translateX(0px)' : 'translateX(80px)',
                        pointerEvents: idx === 0 ? 'auto' : 'none',
                      }}
                    >
                      {/* Top Accent Gradient Line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#8B7CFF] to-sky" />

                      {/* Header & Question */}
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="font-heading font-extrabold text-2xl xl:text-3xl text-text-main tracking-tight leading-snug">
                            {item.question}
                          </h3>
                        </div>

                        {/* Animated Answer Text */}
                        <div id={`faq-answer-${idx}`}>
                          <p className="text-base xl:text-lg text-text-secondary leading-relaxed font-sans font-normal">
                            {item.answer}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Highlight Principle & Progress */}
                      <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs xl:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-text-secondary font-medium">
                            Core Takeaway:
                          </span>
                          <span className="font-semibold text-text-main font-sans">
                            {item.highlight}
                          </span>
                        </div>

                        <div className="text-xs text-text-secondary flex items-center gap-1 font-mono">
                          <span>Sequence:</span>
                          <span className="font-bold text-primary">
                            {Math.round(((idx + 1) / totalSteps) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Integrated Visualizer Component */}
              <div className="mt-6 flex justify-end">
                <FAQVisualizer
                  activeIndex={activeIndex}
                  progressRatio={progressRatio}
                  items={scrollFaqItems}
                  className="scale-90 xl:scale-95 origin-bottom-right"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           MOBILE & TABLET ADAPTATION (Touch-friendly, zero pinning traps or jank)
           ========================================================================= */
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-mono font-bold tracking-wider uppercase mb-4 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>09 / FAQ</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight leading-tight mb-4">
              Common <br />
              <span className="gradient-text">Questions.</span>
            </h2>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto font-sans">
              Everything you need to know before starting a conversation with ANTHIX.
            </p>
          </div>

          {/* Quick-Jump Step Pills (Horizontal Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none justify-start sm:justify-center">
            {scrollFaqItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jumpToQuestion(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeIndex === idx
                    ? 'bg-primary text-white font-bold shadow-soft-xs'
                    : 'bg-background-alt text-text-secondary border border-border hover:border-primary/40'
                }`}
              >
                <span>{item.number}</span>
                <span className="hidden sm:inline">{item.shortTitle}</span>
              </button>
            ))}
          </div>

          {/* Active Question Mobile Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-soft-md relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#8B7CFF] to-sky" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-primary bg-background-lavender px-2.5 py-1 rounded-md border border-primary/20">
                STEP {activeItem.number} / 0{totalSteps}
              </span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {activeItem.category}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-text-main mb-4 leading-snug">
              {activeItem.question}
            </h3>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans mb-6">
              {activeItem.answer}
            </p>

            <div className="pt-4 border-t border-border/70 text-xs sm:text-sm text-text-main font-medium flex items-start gap-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{activeItem.highlight}</span>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-background-alt text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background-lavender"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-mono text-text-secondary font-medium">
                {activeIndex + 1} of {totalSteps}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex === totalSteps - 1}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-deep shadow-soft-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compact Visualizer on Mobile */}
          <div className="flex justify-center my-6">
            <FAQVisualizer
              activeIndex={activeIndex}
              progressRatio={(activeIndex + 1) / totalSteps}
              items={scrollFaqItems}
              className="scale-85"
            />
          </div>

          {/* Full List Alternative for Mobile Readers */}
          <div className="mt-10 pt-8 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 text-center">
              All 7 Questions at a Glance
            </h4>
            <div className="space-y-2">
              {scrollFaqItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpToQuestion(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    activeIndex === idx
                      ? 'border-primary bg-background-lavender/30 text-primary font-semibold'
                      : 'border-border bg-white text-text-main hover:bg-background-alt'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-text-secondary">
                      {item.number}
                    </span>
                    <span className="text-sm font-sans line-clamp-1">
                      {item.question}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
