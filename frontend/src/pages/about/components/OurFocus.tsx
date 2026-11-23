import { Link } from 'react-router-dom';
import { Globe, Bot, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const OurFocus = () => {
  const focusAreas = [
    {
      title: 'Digital Solutions',
      icon: Globe,
      tag: 'Development & Experience',
      description: 'Engineering responsive web applications, modern institutional portals, and high-performance digital experiences tailored to real business objectives.',
      deliverables: ['Custom Web Applications', 'Accessible Design Systems', 'High-Speed Architecture'],
      gradient: 'from-primary/10 via-background-lavender to-white',
    },
    {
      title: 'AI & Automation',
      icon: Bot,
      tag: 'Workflows & Intelligence',
      description: 'Streamlining repetitive operations through custom automation pipelines, document extraction models, and smart triage workflows.',
      deliverables: ['Workflow Orchestration', 'Data Extraction Engines', 'Process Optimization'],
      gradient: 'from-sky-50 via-background-softBlue to-white',
    },
    {
      title: 'Technical Training',
      icon: GraduationCap,
      tag: 'Empowerment & Capability',
      description: 'Delivering hands-on developer workshops, project-based bootcamps for universities, and customized training sprints for engineering teams.',
      deliverables: ['Modern Full-Stack Bootcamps', 'Applied AI Tools Workshops', 'Curriculum Design'],
      gradient: 'from-purple-50 via-background-lavender/60 to-white',
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-border shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>CORE FOCUS</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            Where Ideas Meet <span className="gradient-text">Technology.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            Three synergistic technology domains designed to solve real operational bottlenecks and prepare organizations for the future.
          </p>
        </div>

        {/* Visually connected editorial cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {focusAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="bg-white rounded-3xl p-8 border border-border hover:border-primary/40 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-background-lavender to-background-softBlue text-primary flex items-center justify-center shadow-soft-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-primary bg-background-lavender px-2.5 py-1 rounded-full">
                      {area.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-text-main mb-3">
                    {area.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                    {area.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-border/80 mb-6">
                    {area.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-medium text-text-main font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/services" className="pt-4 border-t border-border block">
                  <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                    Explore {area.title}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Context Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="font-heading font-bold text-base text-text-main">
              Looking for a customized blend of services?
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary font-sans mt-0.5">
              We frequently combine digital development with team training or automation setups.
            </p>
          </div>
          <Link to="/contact">
            <Button size="sm" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Discuss Custom Scope
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
