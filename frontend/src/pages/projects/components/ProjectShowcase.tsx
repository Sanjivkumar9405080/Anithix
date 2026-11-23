import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { projectCardsData } from '../data/projectsData';
import { apiGetPublishedProjects, ProjectItem } from '../../../services/api';
import {
  CrmMockup,
  SchoolMockup,
  HospitalMockup,
  BloodDonationMockup,
  EcommerceMockup,
  AiWorkflowMockup,
} from './mockups';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface DisplayCard {
  id: string;
  number: string;
  category: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  entryDirection: 'left' | 'right';
  mockupType: string;
  surfaceTheme: string;
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
}

export const ProjectShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const previewsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const [cards, setCards] = useState<DisplayCard[]>(() =>
    projectCardsData.map((p) => ({
      id: p.id,
      number: p.number,
      category: p.category,
      badge: p.badge,
      title: p.title,
      description: p.description,
      tags: p.tags,
      entryDirection: p.entryDirection,
      mockupType: p.mockupType,
      surfaceTheme: p.surfaceTheme,
    }))
  );

  // Fetch real published projects from MongoDB
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const res = await apiGetPublishedProjects();
        if (isMounted && res.success && res.data && res.data.projects.length > 0) {
          const apiProjects: DisplayCard[] = res.data.projects.map((item: ProjectItem, idx: number) => ({
            id: item._id,
            number: String(idx + 1).padStart(2, '0'),
            category: item.category || 'Platform Solution',
            badge: item.badge || 'Live Production',
            title: item.title,
            description: item.shortDescription || item.description,
            tags: item.technologies && item.technologies.length > 0 ? item.technologies : ['Scalable', 'Cloud', 'Modern'],
            entryDirection: idx % 2 === 0 ? 'left' : 'right',
            mockupType: item.mockupType || 'crm',
            surfaceTheme: item.surfaceTheme || 'violet-lavender',
            liveDemoUrl: item.liveDemoUrl,
            sourceCodeUrl: item.sourceCodeUrl,
          }));

          setCards(apiProjects);
        }
      } catch (err) {
        // Silently keep default fallback cards
        console.warn('Using initial project concepts (offline/fallback mode)', err);
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll-Triggered Alternating Side-Entry Animation
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      cards.forEach((project, idx) => {
        const card = cardsRef.current[idx];
        const preview = previewsRef.current[idx];
        if (!card) return;

        const isLeft = project.entryDirection === 'left';
        // Distance: 80px on desktop, 40px on small screens
        const xOffset = isLeft ? -80 : 80;

        // Individual ScrollTrigger for each card as user scrolls down
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // 1. Card enters from side with opacity and subtle scale
        tl.fromTo(
          card,
          {
            x: xOffset,
            opacity: 0,
            scale: 0.97,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power2.out',
          }
        );

        // 2. Internal project interface preview enters with a slight stagger
        if (preview) {
          tl.fromTo(
            preview,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
            },
            '<0.15'
          );
        }
      });
    }, sectionRef);

    // Refresh ScrollTrigger to recalculate card coordinates
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [prefersReducedMotion, cards]);

  // Mockup Renderer
  const renderMockup = (type: string) => {
    switch (type) {
      case 'crm':
        return <CrmMockup />;
      case 'school':
        return <SchoolMockup />;
      case 'hospital':
        return <HospitalMockup />;
      case 'blood-donation':
        return <BloodDonationMockup />;
      case 'ecommerce':
        return <EcommerceMockup />;
      case 'ai-workflow':
        return <AiWorkflowMockup />;
      default:
        return <CrmMockup />;
    }
  };

  // Border & Accent Color Palette per Card
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'violet-lavender':
        return {
          badgeBg: 'bg-background-lavender text-primary-deep border-primary/20',
          accentGradient: 'from-primary via-[#8B7CFF] to-sky',
          hoverBorder: 'hover:border-primary/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(99,91,255,0.12)]',
        };
      case 'soft-blue':
        return {
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
          accentGradient: 'from-sky-400 via-primary to-sky-300',
          hoverBorder: 'hover:border-sky-400/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(56,189,248,0.14)]',
        };
      case 'white-blue':
        return {
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          accentGradient: 'from-emerald-400 via-primary to-sky-400',
          hoverBorder: 'hover:border-emerald-400/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(16,185,129,0.12)]',
        };
      case 'coral-lavender':
        return {
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          accentGradient: 'from-rose-400 via-primary to-rose-300',
          hoverBorder: 'hover:border-rose-400/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(244,63,94,0.12)]',
        };
      case 'soft-lavender':
        return {
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          accentGradient: 'from-amber-400 via-primary to-sky',
          hoverBorder: 'hover:border-amber-400/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(245,158,11,0.12)]',
        };
      case 'pale-sky':
        return {
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          accentGradient: 'from-purple-500 via-primary to-sky-400',
          hoverBorder: 'hover:border-purple-400/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(168,85,247,0.14)]',
        };
      default:
        return {
          badgeBg: 'bg-background-lavender text-primary border-primary/20',
          accentGradient: 'from-primary via-[#8B7CFF] to-sky',
          hoverBorder: 'hover:border-primary/50',
          hoverShadow: 'hover:shadow-[0_20px_45px_rgba(99,91,255,0.12)]',
        };
    }
  };

  return (
    <section
      id="project-grid-section"
      ref={sectionRef}
      className="py-16 sm:py-24 px-4 sm:px-8 bg-white relative overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Subheader Info */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 pb-6 border-b border-border/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-mono font-bold tracking-wider uppercase mb-2 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>INTERACTIVE PLATFORM SHOWCASE</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-text-main tracking-tight">
              Featured Systems &amp; Platforms
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary max-w-sm font-sans font-normal">
            Scroll down to explore each platform entering from alternating sides. Managed and published live via the ANTHIX admin dashboard.
          </p>
        </div>

        {/* =========================================================================
            TWO-COLUMN GRID WITH SCROLL-TRIGGERED ALTERNATING SIDE-ENTRY ANIMATIONS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((project, idx) => {
            const theme = getThemeClasses(project.surfaceTheme);

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className={`group relative bg-white rounded-3xl p-6 sm:p-9 border border-border ${theme.hoverBorder} shadow-soft-sm ${theme.hoverShadow} transition-all duration-300 flex flex-col justify-between overflow-hidden will-change-transform transform hover:-translate-y-1.5`}
              >
                {/* Top Subtle Gradient Edge Accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.accentGradient} opacity-90`}
                />

                {/* Card Header: Number, Category & Prototype Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-black text-2xl sm:text-3xl text-primary">
                        {project.number}
                      </span>
                      <div className="h-4 w-[1px] bg-border" />
                      <span className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                        {project.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}
                    >
                      {project.badge}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-text-main tracking-tight leading-snug mb-3 group-hover:text-primary transition-colors duration-200">
                    {project.title}
                  </h3>

                  {/* Project Short Description */}
                  <p className="text-sm text-text-secondary leading-relaxed font-sans font-normal mb-5">
                    {project.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-main bg-background-alt px-2.5 py-1 rounded-lg border border-border/80"
                      >
                        <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Project-Interface Preview (Staggered Animation Target) */}
                <div
                  ref={(el) => {
                    previewsRef.current[idx] = el;
                  }}
                  className="my-3 transition-transform duration-300 group-hover:scale-[1.01]"
                >
                  {renderMockup(project.mockupType)}
                </div>

                {/* Card Footer: Explore Concept Action Link */}
                <div className="pt-5 mt-4 border-t border-border/70 flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-mono">
                    Entry: {project.entryDirection.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-3">
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-main transition-colors"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-primary hover:text-primary-deep transition-all duration-200"
                    >
                      <span>Explore Concept</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
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
