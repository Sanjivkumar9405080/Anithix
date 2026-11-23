import { useState } from 'react';
import { 
  Monitor, 
  Workflow, 
  BookOpen, 
  ArrowUpRight, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface ProjectConceptsProps {
  onSelectService: (service: ServiceType) => void;
}

export const ProjectConcepts = ({ onSelectService }: ProjectConceptsProps) => {
  const [activeConcept, setActiveConcept] = useState<number>(0);

  const concepts = [
    {
      id: 'concept-01',
      badge: 'Concept 01',
      serviceType: 'Digital Solutions' as ServiceType,
      title: 'Digital Experience',
      domain: 'Education & Institutional Portals',
      description: 'An ultra-responsive, accessible digital portal designed for modern academic institutions and innovative startups. Features clean typographic hierarchy, instant search, and intuitive mobile enrollment.',
      highlights: ['Responsive Framework', 'Accessible Design (WCAG 2.1)', 'Sub-second Page Loads'],
      icon: Monitor,
      visualType: 'portal',
    },
    {
      id: 'concept-02',
      badge: 'Concept 02',
      serviceType: 'AI & Automation' as ServiceType,
      title: 'Intelligent Workflow',
      domain: 'Operational Healthcare & Operations',
      description: 'An automated routing engine that accepts incoming patient inquiries or client request documents, parses core fields with zero human data entry, and synchronizes records across internal systems.',
      highlights: ['Document Extraction', 'Event-Driven Webhooks', 'Automated Triage'],
      icon: Workflow,
      visualType: 'workflow',
    },
    {
      id: 'concept-03',
      badge: 'Concept 03',
      serviceType: 'Technical Training' as ServiceType,
      title: 'Learning Platform',
      domain: 'Workforce & University Academies',
      description: 'An interactive cohort-based developer sandbox where students test real TypeScript/React components, execute automated challenges, and receive immediate architectural feedback.',
      highlights: ['Interactive Code Exercises', 'Progress Tracking', 'Curated Workshop Sprints'],
      icon: BookOpen,
      visualType: 'learning',
    },
  ];

  const handleDiscussConcept = (service: ServiceType) => {
    onSelectService(service);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="concepts" className="py-24 sm:py-32 px-4 sm:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>IDEAS IN PRACTICE</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            Possibilities worth exploring.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            Illustrative architectural concepts showing how digital engineering, automation, and structured training manifest in real scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            const isHovered = activeConcept === index;

            return (
              <div
                key={concept.id}
                onMouseEnter={() => setActiveConcept(index)}
                className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isHovered
                    ? 'border-primary/50 shadow-soft-lg -translate-y-1 bg-white'
                    : 'border-border shadow-soft-sm bg-background-alt'
                }`}
              >
                <div className="h-56 sm:h-64 p-6 bg-gradient-to-br from-background-lavender/40 to-background-softBlue/40 relative flex flex-col justify-between border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border shadow-soft-xs">
                      {concept.badge}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-text-secondary/80 bg-white/60 px-2.5 py-1 rounded-md font-sans">
                      Illustrative Concept
                    </span>
                  </div>

                  {concept.visualType === 'portal' && (
                    <div className="bg-white rounded-xl p-3.5 border border-border shadow-soft-md transform rotate-1 group-hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-border/80">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="h-1.5 w-16 bg-border rounded-full" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-primary/20 rounded" />
                        <div className="h-2 w-4/5 bg-background-lavender rounded" />
                        <div className="h-2 w-2/3 bg-background-softBlue rounded" />
                      </div>
                    </div>
                  )}

                  {concept.visualType === 'workflow' && (
                    <div className="bg-white rounded-xl p-3.5 border border-border shadow-soft-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-text-main font-heading">Automated Pipeline</div>
                          <div className="text-[9px] text-text-secondary font-sans">Sync: Form → CRM → Staff</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-primary font-bold">100% Auto</span>
                    </div>
                  )}

                  {concept.visualType === 'learning' && (
                    <div className="bg-white rounded-xl p-3.5 border border-border shadow-soft-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-purple-600 font-bold">challenge_04.tsx</span>
                        <span className="text-[9px] font-bold text-emerald-600 font-sans">Tests Passing</span>
                      </div>
                      <div className="font-mono text-[9px] text-text-secondary bg-background-alt p-2 rounded">
                        &lt;WorkshopModule status="active" /&gt;
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary font-sans">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{concept.domain}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-text-main mb-3">
                      {concept.title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed mb-6 font-normal font-sans">
                      {concept.description}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {concept.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-text-main font-medium font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => handleDiscussConcept(concept.serviceType)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-deep group font-sans"
                    >
                      <span>Explore this concept</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                    <span className="text-[11px] font-mono text-text-secondary">
                      Concept Spec
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-xs text-text-secondary max-w-xl mx-auto font-sans">
          * ANTHIX maintains strict client confidentiality. The showcases above illustrate our architectural patterns and delivery standards.
        </div>
      </div>
    </section>
  );
};
