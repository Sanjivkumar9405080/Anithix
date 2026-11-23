import { Link } from 'react-router-dom';
import { ArrowRight, Layout, Globe, Smartphone, Palette, ShieldCheck, Activity, BarChart3, Zap } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const DigitalSolutions = () => {
  const capabilities = [
    {
      title: 'Website Development',
      description: 'High-performance, modern web experiences engineered with accessible code, search optimization, and lightning-fast load times.',
      icon: Globe,
    },
    {
      title: 'Web Application Development',
      description: 'Dynamic cloud-native applications with clean component architecture, reactive data flows, and secure API integrations.',
      icon: Layout,
    },
    {
      title: 'UI/UX Design Systems',
      description: 'Systematic interface designs with purposeful typography, thoughtful component libraries, and intuitive user journeys.',
      icon: Palette,
    },
    {
      title: 'Responsive Digital Experiences',
      description: 'Tailored digital solutions calibrated to deliver flawless usability across mobile, tablet, desktop, and large displays.',
      icon: Smartphone,
    },
  ];

  return (
    <section id="digital-solutions" className="py-20 lg:py-28 px-4 sm:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-5 border border-primary/20">
              <span>01 / DIGITAL SOLUTIONS</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Digital Experiences Built With <span className="gradient-text">Purpose.</span>
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans mb-8">
              We create digital experiences that bring clarity to complex ideas and make technology easier to use.
            </p>

            {/* Capabilities Accordion / List */}
            <div className="space-y-4 w-full mb-10">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className="p-4 rounded-2xl bg-background-alt border border-border hover:border-primary/30 transition-all hover:shadow-soft-xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-background-lavender text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-text-main mb-1">
                          {cap.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link to="/contact">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                Discuss Your Project
              </Button>
            </Link>
          </div>

          {/* Right Column: High-Fidelity Browser Mockup */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-white border border-border shadow-soft-lg overflow-hidden group">
              {/* Browser Window Chrome */}
              <div className="bg-background-alt px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white border border-border text-xs text-text-secondary font-mono w-1/2 max-w-xs justify-center shadow-soft-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>app.anthix.cloud/analytics</span>
                </div>
                <div className="text-[11px] font-semibold text-text-secondary font-mono">
                  v2.4.0
                </div>
              </div>

              {/* Fictional Product Interface Visual */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-white via-background-alt/30 to-background-alt/70 space-y-6">
                {/* Interface Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Workspace Overview</span>
                    <h4 className="font-heading font-extrabold text-xl text-text-main">Digital Platform Operations</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> 99.98% Uptime
                    </span>
                    <span className="px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-bold border border-primary/20 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-primary" /> Fast SSR
                    </span>
                  </div>
                </div>

                {/* Dashboard Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-border shadow-soft-xs">
                    <div className="text-[11px] text-text-secondary mb-1 flex items-center justify-between">
                      <span>Response Latency</span>
                      <Activity className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="font-heading font-extrabold text-2xl text-text-main">48ms</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">Core Web Vitals Pass</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border shadow-soft-xs">
                    <div className="text-[11px] text-text-secondary mb-1 flex items-center justify-between">
                      <span>Accessible Routes</span>
                      <BarChart3 className="w-3 h-3 text-primary" />
                    </div>
                    <div className="font-heading font-extrabold text-2xl text-text-main">100%</div>
                    <div className="text-[10px] text-primary font-semibold mt-1">WCAG 2.1 AA Compliant</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border shadow-soft-xs col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-text-secondary mb-1 flex items-center justify-between">
                      <span>Active Deployments</span>
                      <ShieldCheck className="w-3 h-3 text-sky" />
                    </div>
                    <div className="font-heading font-extrabold text-2xl text-text-main">12 Live</div>
                    <div className="text-[10px] text-sky font-semibold mt-1">Automated CI/CD</div>
                  </div>
                </div>

                {/* Simulated Chart & Workflow Visual */}
                <div className="p-5 rounded-2xl bg-white border border-border shadow-soft-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-text-main">Traffic Throughput & Performance Index</div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-text-secondary">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Edge Delivery</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky" /> Asset Cache</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-32 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#635BFF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#635BFF" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#E8EAF2" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="500" y2="70" stroke="#E8EAF2" strokeDasharray="3 3" />
                      <line x1="0" y1="110" x2="500" y2="110" stroke="#E8EAF2" />

                      {/* Area Fill */}
                      <path
                        d="M0,90 Q80,40 160,60 T320,30 T500,20 L500,110 L0,110 Z"
                        fill="url(#chartGrad)"
                      />

                      {/* Smooth primary line */}
                      <path
                        d="M0,90 Q80,40 160,60 T320,30 T500,20"
                        fill="none"
                        stroke="#635BFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Secondary line */}
                      <path
                        d="M0,100 Q80,75 160,85 T320,55 T500,45"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />

                      {/* Glowing active node dot */}
                      <circle cx="320" cy="30" r="5" fill="#635BFF" />
                      <circle cx="320" cy="30" r="9" fill="#635BFF" fillOpacity="0.2" />
                    </svg>
                  </div>
                </div>

                {/* Component Architecture Status Ribbon */}
                <div className="flex flex-wrap items-center justify-between text-xs text-text-secondary gap-2 px-1">
                  <span>Architecture: Modern Component Model</span>
                  <span className="font-mono text-[11px] text-text-main font-semibold">Zero Unnecessary Bloat</span>
                </div>
              </div>
            </div>

            {/* Illustrative Concept Disclaimer Note */}
            <p className="text-[11px] text-text-secondary/80 mt-3 text-center sm:text-right font-sans">
              * Illustrative interface prototype designed to demonstrate ANTHIX digital architecture capabilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
