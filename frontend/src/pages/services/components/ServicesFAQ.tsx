import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const ServicesFAQ = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'What services does ANTHIX offer?',
      answer:
        'ANTHIX focuses on three core pillars: Digital Solutions (custom web applications, responsive websites, UI/UX systems), AI & Automation (targeted LLM integrations, deterministic workflow automation, data pipelines), and Technical Training (hands-on workshops, bootcamps, and developer skill acceleration for institutions and teams).',
    },
    {
      id: 'faq-2',
      question: 'Can ANTHIX help with a custom website or web application?',
      answer:
        'Yes. We build tailored web applications and high-performance digital platforms from architectural conception to deployment. Every build prioritizes clean code, responsive layouts, accessibility compliance (WCAG 2.1), and rapid load speeds without bloated templates.',
    },
    {
      id: 'faq-3',
      question: 'Can AI and automation be tailored to our workflow?',
      answer:
        'Absolutely. We analyze your specific operational bottlenecks and software stack to create deterministic automation pipelines and focused AI integrations. Rather than fragile generic bots, our workflows integrate into your existing tools with complete auditability and error boundaries.',
    },
    {
      id: 'faq-4',
      question: 'Does ANTHIX provide technical training for institutions?',
      answer:
        'Yes. We provide structured, interactive curriculum modules and workshops for universities, colleges, and engineering teams. Our programs emphasize practical problem-solving, modern web development, applied AI architectures, and building production-ready projects.',
    },
    {
      id: 'faq-5',
      question: 'How can we discuss a project with ANTHIX?',
      answer:
        'You can reach out through our Contact page. Share a summary of your requirements, ideas, or operational goals, and we will schedule an introductory discussion to review your scope and suggest a pragmatic path forward.',
    },
  ];

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>CLARITY & QUESTIONS</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-5">
            Frequently Asked <span className="gradient-text">Questions.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
            Here are clear answers regarding how we collaborate, build, and support our partners.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-background-alt/50 border-primary/30 shadow-soft-xs'
                    : 'bg-white border-border hover:border-border/80'
                }`}
              >
                <button
                  type="button"
                  id={`button-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${faq.id}`}
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-2xl"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-text-main">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-primary text-white rotate-180'
                        : 'bg-background-alt text-text-secondary border border-border'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`button-${faq.id}`}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-text-secondary leading-relaxed font-sans border-t border-border/40"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
