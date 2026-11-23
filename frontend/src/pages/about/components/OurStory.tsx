import { Globe, Bot, GraduationCap, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OurStory = () => {
  const pillars = [
    {
      title: 'Digital Solutions',
      icon: Globe,
      summary: 'Creating useful, modern digital experiences.',
      description: 'We build web applications, business platforms, and responsive interfaces that look exceptional, operate reliably, and provide direct utility to users.',
      tags: ['Modern Architecture', 'High Speed', 'Accessibility-first'],
      accent: 'text-primary bg-background-lavender',
    },
    {
      title: 'AI & Automation',
      icon: Bot,
      summary: 'Simplifying workflows and exploring intelligent solutions.',
      description: 'Rather than adding complexity, we employ automation and AI to eliminate repetitive burdens, parse complex information, and streamline day-to-day operations.',
      tags: ['Intelligent Workflows', 'Document Extraction', 'System Sync'],
      accent: 'text-sky-600 bg-sky-50',
    },
    {
      title: 'Technical Training',
      icon: GraduationCap,
      summary: 'Helping people develop practical, future-ready skills.',
      description: 'We believe genuine digital transformation requires empowered people. We design hands-on workshops and bootcamps for university students and team engineers.',
      tags: ['Project-Based Sprints', 'MERN & Full-Stack', 'Applied Tooling'],
      accent: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-border shadow-soft-sm">
            <span>WHO WE ARE</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
            Technology With a Purpose.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
            At ANTHIX, we focus on solving real problems through practical innovation, thoughtful engineering, and continuous learning. We view technology as a bridge—connecting ambitious ideas with tangible, enduring impact.
          </p>
        </div>

        {/* 3 Pillars Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-3xl p-8 border border-border hover:border-primary/40 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-soft-xs ${pillar.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-text-main mb-2">
                    {pillar.title}
                  </h3>

                  <div className="text-sm font-semibold text-primary mb-4 font-sans">
                    {pillar.summary}
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                    {pillar.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-border/80">
                    {pillar.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2 text-xs font-medium text-text-main font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-deep group font-sans"
                  >
                    <span>Learn about {pillar.title}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
