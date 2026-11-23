import { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import { FAQCategory, faqData } from '../data/faqData';
import { FAQCategories } from './FAQCategories';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const FAQAccordion = () => {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Compute question counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<FAQCategory, number> = {
      all: faqData.length,
      general: 0,
      'digital-solutions': 0,
      'ai-automation': 0,
      'technical-training': 0,
      projects: 0,
    };

    faqData.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, []);

  // Filter questions based on category
  const visibleQuestions = useMemo(() => {
    if (activeCategory === 'all') return faqData;
    return faqData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const toggleQuestion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // ScrollTrigger entrance animation on mount
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-accordion-item',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Subtle cross-fade when category changes
  useEffect(() => {
    if (prefersReducedMotion || !listRef.current) return;

    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
    );
  }, [activeCategory, prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="faq-list" className="py-10 sm:py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Category Filter Pills */}
        <FAQCategories
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setOpenId(null);
          }}
          categoryCounts={categoryCounts}
        />

        {/* Minimal Animated Accordion List */}
        <div ref={listRef} className="space-y-3.5">
          {visibleQuestions.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`faq-accordion-item rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'bg-background-lavender/30 border-primary/40 shadow-soft-xs'
                    : 'bg-white border-border/80 hover:border-primary/30 hover:bg-background-alt/40'
                }`}
              >
                {/* Question Trigger Button */}
                <button
                  type="button"
                  id={`faq-btn-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full py-5 px-5 sm:px-7 flex items-center justify-between text-left gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    <span className="font-mono text-xs font-semibold text-text-secondary/60 shrink-0">
                      {item.id.replace('faq-', '').padStart(2, '0')}
                    </span>
                    <span
                      className={`font-heading font-extrabold text-base sm:text-lg transition-colors duration-200 ${
                        isOpen ? 'text-primary' : 'text-text-main group-hover:text-primary'
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  {/* Minimal Animated Plus / Minus Icon */}
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-primary text-white border-primary rotate-45 shadow-soft-xs'
                        : 'bg-background-alt text-text-secondary border-border/70 group-hover:border-primary/40 group-hover:text-primary rotate-0'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </button>

                {/* Smooth Animated Height & Opacity Answer Panel */}
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    prefersReducedMotion ? '' : 'transition-all'
                  } ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-text-secondary leading-relaxed font-sans border-t border-border/40">
                      <p className="max-w-3xl">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
