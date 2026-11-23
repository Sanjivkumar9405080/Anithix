import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Briefcase,
  GraduationCap,
  Activity,
  Heart,
  ShoppingBag,
  Bot,
  Globe,
  LayoutDashboard,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { projectCategories, ProjectCategory } from '../data/projectsData';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ProjectCategories = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-category-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
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

  const renderIcon = (name: string) => {
    const iconProps = { className: 'w-6 h-6 stroke-[2]' };
    switch (name) {
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'graduation-cap':
        return <GraduationCap {...iconProps} />;
      case 'activity':
        return <Activity {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'shopping-bag':
        return <ShoppingBag {...iconProps} />;
      case 'bot':
        return <Bot {...iconProps} />;
      case 'globe':
        return <Globe {...iconProps} />;
      case 'layout-dashboard':
        return <LayoutDashboard {...iconProps} />;
      default:
        return <Layers {...iconProps} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-white via-background-alt/30 to-white relative border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20 shadow-soft-xs">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>DISCIPLINES &amp; APPLICATIONS</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main tracking-tight leading-[1.12] mb-5">
            More Ways We <span className="gradient-text">Can Build.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans font-normal max-w-2xl mx-auto">
            From specialized institutional systems to consumer storefronts, explore the diverse product domains we architect and deploy.
          </p>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectCategories.map((cat: ProjectCategory, idx: number) => {
            return (
              <div
                key={cat.id}
                className="project-category-card group relative bg-white rounded-3xl p-6 sm:p-7 border border-border hover:border-primary/40 shadow-soft-xs hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Subtle Edge Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#8B7CFF] to-sky rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Icon & Category Index */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-soft-xs">
                      {renderIcon(cat.iconName)}
                    </div>
                    <span className="text-xs font-mono font-bold text-text-secondary bg-background-alt px-2.5 py-1 rounded-md border border-border">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-text-main tracking-tight mb-2.5 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans mb-6">
                    {cat.description}
                  </p>
                </div>

                {/* Tags & Action Link */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-text-secondary bg-background-alt px-2 py-0.5 rounded border border-border/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-text-main group-hover:text-primary transition-colors"
                  >
                    <span>Request Concept Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
