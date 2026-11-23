import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Globe, 
  Bot, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  Code2, 
  Cpu, 
  Sparkles, 
  Terminal,
  Activity,
  Workflow,
  ChevronRight,
  MoveRight,
} from 'lucide-react';
import { ServiceType } from '../../../types';
import { Button } from '../../../components/common/Button';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ServicesPreviewProps {
  onSelectService: (service: ServiceType) => void;
}

export const ServicesPreview = ({ onSelectService }: ServicesPreviewProps) => {
  const [activeBrowserTab, setActiveBrowserTab] = useState<'desktop' | 'mobile'>('desktop');
  const [activeAiPulse, setActiveAiPulse] = useState(0);
  const [activeServiceIdx, setActiveServiceIdx] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const services = [
    {
      id: 'digital-solutions',
      number: '01',
      title: 'Digital Solutions',
      serviceType: 'Digital Solutions' as ServiceType,
      tagline: 'Modern websites, web applications, and digital experiences designed around your goals.',
      description: 'We build fast, secure, and meticulously crafted web platforms designed to give your organization a commanding digital presence. From intuitive responsive interfaces to robust full-stack applications.',
      offerings: [
        'Business websites',
        'Landing pages',
        'Web applications',
        'Website redesign',
        'UI development',
        'Website maintenance',
      ],
      ctaText: 'Explore Digital Solutions',
      icon: Globe,
    },
    {
      id: 'ai-automation',
      number: '02',
      title: 'AI & Automation',
      serviceType: 'AI & Automation' as ServiceType,
      tagline: 'Practical AI integrations and automation ideas that help simplify everyday workflows.',
      description: 'Streamline daily administrative and operational burdens through custom automated workflows, smart document parsers, and purpose-driven AI integrations tailored to your real workflows.',
      offerings: [
        'AI integrations',
        'Workflow automation',
        'Productivity solutions',
        'Process improvement',
        'Custom automation concepts',
        'Data synthesis & alerts',
      ],
      ctaText: 'Explore AI Solutions',
      icon: Bot,
    },
    {
      id: 'technical-training',
      number: '03',
      title: 'Technical Training',
      serviceType: 'Technical Training' as ServiceType,
      tagline: 'Hands-on technology learning that helps students and teams develop practical skills.',
      description: 'Bridge the gap between theoretical knowledge and production-ready industry practices. We design engaging, hands-on technical workshops and structured bootcamps for colleges, schools, and enterprise teams.',
      offerings: [
        'Web development workshops',
        'MERN stack learning',
        'Programming fundamentals',
        'AI tool workshops',
        'Project-based learning',
        'Customized technical sessions',
      ],
      ctaText: 'Explore Training',
      icon: GraduationCap,
    },
  ];

  const handleCta = (service: ServiceType) => {
    onSelectService(service);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Horizontal Pinned Scroll Animation on Desktop
  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !sectionRef.current || !pinnedRef.current || !trackRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(trackWidth - viewportWidth + 120);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'horizontal-services-trigger',
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: pinnedRef.current,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(Math.floor(p * 3), 2);
            setActiveServiceIdx(idx);
          },
        },
      });

      tl.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  // Jump to service card
  const jumpToService = (idx: number) => {
    if (isDesktop && !prefersReducedMotion) {
      const st = ScrollTrigger.getById('horizontal-services-trigger');
      if (st) {
        const targetProgress = (idx + 0.35) / 3;
        const targetScroll = st.start + targetProgress * (st.end - st.start);
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
        return;
      }
    }
    setActiveServiceIdx(idx);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`relative w-full bg-white ${
        isDesktop && !prefersReducedMotion ? 'min-h-[280vh]' : 'py-20 sm:py-28 px-4 sm:px-8'
      }`}
    >
      {/* =========================================================================
          DESKTOP PINNED HORIZONTAL SIDE-SCROLLING TRACK
          ========================================================================= */}
      {isDesktop && !prefersReducedMotion ? (
        <div
          ref={pinnedRef}
          className="w-full h-screen flex flex-col justify-between pt-20 pb-8 px-8 lg:px-14 overflow-hidden bg-white relative z-20"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-primary/10 via-sky/10 to-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Pinned Header Bar */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender text-primary-deep text-xs font-mono font-bold tracking-wider uppercase mb-2 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>03 / CAPABILITIES</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl lg:text-3xl text-text-main tracking-tight">
                Engineered for Purpose. <span className="gradient-text">Built for Scale.</span>
              </h2>
            </div>

            {/* Quick-Jump Step Indicator Pills */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-background-alt p-1 rounded-full border border-border">
                {services.map((srv, idx) => (
                  <button
                    key={srv.id}
                    onClick={() => jumpToService(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-200 cursor-pointer ${
                      activeServiceIdx === idx
                        ? 'bg-primary text-white shadow-soft-xs'
                        : 'text-text-secondary hover:text-text-main'
                    }`}
                  >
                    <span>{srv.number} {srv.title}</span>
                  </button>
                ))}
              </div>

              <div className="hidden xl:flex items-center gap-1.5 text-xs text-text-secondary pl-3 font-mono">
                <MoveRight className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Scroll to travel horizontally</span>
              </div>
            </div>
          </div>

          {/* Main Horizontal Sliding Track Container */}
          <div className="relative w-full flex-1 flex items-center overflow-visible">
            <div
              ref={trackRef}
              className="flex items-center gap-8 lg:gap-12 flex-nowrap will-change-transform pl-4 pr-16"
            >
              {/* CARD 01: DIGITAL SOLUTIONS */}
              <div className="w-[82vw] max-w-5xl shrink-0 bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-border shadow-[0_20px_50px_rgba(99,91,255,0.06)] hover:border-primary/40 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-heading font-black text-2xl text-primary">01</span>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">
                          DIGITAL SOLUTIONS
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-2xl lg:text-3xl text-text-main mb-4 leading-snug">
                        {services[0].tagline}
                      </h3>

                      <p className="text-text-secondary text-sm lg:text-base leading-relaxed mb-6 font-sans">
                        {services[0].description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {services[0].offerings.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-text-main font-sans">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Button
                        onClick={() => handleCta('Digital Solutions')}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        {services[0].ctaText}
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="bg-background-alt rounded-2xl border border-border shadow-soft-sm p-4 sm:p-6 relative overflow-hidden">
                      <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-4 py-1 rounded-full bg-white text-[11px] font-mono text-text-secondary border border-border flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          anthix.digital/experience
                        </div>
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-border">
                          <button
                            onClick={() => setActiveBrowserTab('desktop')}
                            className={`px-2.5 py-0.5 text-[11px] font-medium rounded ${
                              activeBrowserTab === 'desktop' ? 'bg-primary text-white shadow-xs font-bold' : 'text-text-secondary'
                            }`}
                          >
                            Desktop
                          </button>
                          <button
                            onClick={() => setActiveBrowserTab('mobile')}
                            className={`px-2.5 py-0.5 text-[11px] font-medium rounded ${
                              activeBrowserTab === 'mobile' ? 'bg-primary text-white shadow-xs font-bold' : 'text-text-secondary'
                            }`}
                          >
                            Mobile
                          </button>
                        </div>
                      </div>

                      <div className={`transition-all duration-300 mx-auto ${activeBrowserTab === 'mobile' ? 'max-w-[280px]' : 'w-full'}`}>
                        <div className="bg-gradient-to-br from-background-lavender/60 to-background-softBlue/40 rounded-xl p-4 border border-primary/20 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Fast • Accessible • Modern</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              99 Lighthouse
                            </span>
                          </div>
                          <div className="h-3 w-3/4 bg-primary/20 rounded-full mb-2" />
                          <div className="h-2 w-1/2 bg-primary/10 rounded-full mb-4" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded-lg border border-border text-center">
                              <Layers className="w-4 h-4 text-primary mx-auto mb-1" />
                              <div className="text-[9px] font-bold text-text-main font-heading">Modular UI</div>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-border text-center">
                              <Activity className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                              <div className="text-[9px] font-bold text-text-main font-heading">High Speed</div>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-border text-center">
                              <Code2 className="w-4 h-4 text-primary-deep mx-auto mb-1" />
                              <div className="text-[9px] font-bold text-text-main font-heading">Clean Code</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-border flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              A
                            </div>
                            <div>
                              <div className="text-xs font-bold text-text-main font-heading">Responsive & Clean</div>
                              <div className="text-[10px] text-text-secondary font-sans">Tailored to your audience</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-primary font-sans">Live Showcase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 02: AI & AUTOMATION */}
              <div className="w-[82vw] max-w-5xl shrink-0 bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-border shadow-[0_20px_50px_rgba(99,91,255,0.06)] hover:border-primary/40 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-heading font-black text-2xl text-primary">02</span>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">
                          AI & AUTOMATION
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-2xl lg:text-3xl text-text-main mb-4 leading-snug">
                        {services[1].tagline}
                      </h3>

                      <p className="text-text-secondary text-sm lg:text-base leading-relaxed mb-6 font-sans">
                        {services[1].description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {services[1].offerings.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-text-main font-sans">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Button
                        onClick={() => handleCta('AI & Automation')}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        {services[1].ctaText}
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="bg-background-alt rounded-2xl border border-border shadow-soft-sm p-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-text-main uppercase tracking-wider font-heading">
                            Intelligent Automation Flow
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-primary bg-background-lavender px-2 py-0.5 rounded-full font-semibold">
                          Live Logic
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <Workflow className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-text-main font-heading">Trigger: Raw Inflow</div>
                            <div className="text-[11px] text-text-secondary font-sans">Inquiries, forms, docs & spreadsheets</div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            Active
                          </span>
                        </div>

                        <div 
                          onClick={() => setActiveAiPulse((prev) => (prev + 1) % 3)}
                          className="cursor-pointer p-4 rounded-xl bg-gradient-to-r from-background-lavender to-background-softBlue border-2 border-primary/30 shadow-soft-xs relative transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Bot className="w-5 h-5 text-primary" />
                              <span className="text-xs font-bold text-primary-deep uppercase font-heading">ANTHIX AI Orchestrator</span>
                            </div>
                            <span className="text-[10px] font-semibold text-primary bg-white/80 px-2 py-0.5 rounded-full border border-primary/20">
                              {['Parsing & Ingestion', 'Semantic Validation', 'Automated Dispatch'][activeAiPulse]}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-snug font-sans">
                            Validates data, classifies urgency, extracts structured fields, and triggers downstream automations. (Click to simulate next phase)
                          </p>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-text-main font-heading">Automated Outcome</div>
                            <div className="text-[11px] text-text-secondary font-sans">Instant dispatch, organized database, notified team</div>
                          </div>
                          <span className="text-[10px] font-mono text-primary font-semibold">Zero Friction</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 03: TECHNICAL TRAINING */}
              <div className="w-[82vw] max-w-5xl shrink-0 bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-border shadow-[0_20px_50px_rgba(99,91,255,0.06)] hover:border-primary/40 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-heading font-black text-2xl text-primary">03</span>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">
                          TECHNICAL TRAINING
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-2xl lg:text-3xl text-text-main mb-4 leading-snug">
                        {services[2].tagline}
                      </h3>

                      <p className="text-text-secondary text-sm lg:text-base leading-relaxed mb-6 font-sans">
                        {services[2].description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {services[2].offerings.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-text-main font-sans">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Button
                        onClick={() => handleCta('Technical Training')}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        {services[2].ctaText}
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="bg-background-alt rounded-2xl border border-border shadow-soft-sm p-6 space-y-3.5">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-text-main uppercase tracking-wider font-heading">
                            Curriculum Tracks
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-primary bg-background-lavender px-2 py-0.5 rounded-full font-semibold">
                          Hands-on & Practical
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-border flex items-center justify-between hover:border-primary/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            01
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text-main font-heading">Modern Web & Full-Stack</div>
                            <div className="text-[11px] text-text-secondary font-sans">HTML, CSS, TypeScript, React, Node.js</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-text-secondary bg-background-alt px-2 py-1 rounded border border-border font-sans">
                          Project-Based
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-border flex items-center justify-between hover:border-primary/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">
                            02
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text-main font-heading">Applied AI & Tooling</div>
                            <div className="text-[11px] text-text-secondary font-sans">LLM workflows, prompt mechanics, developer tools</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-text-secondary bg-background-alt px-2 py-1 rounded border border-border font-sans">
                          Interactive
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-border flex items-center justify-between hover:border-primary/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                            03
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text-main font-heading">Customized Team Bootcamps</div>
                            <div className="text-[11px] text-text-secondary font-sans">Tailored technical training for colleges & companies</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-primary bg-background-lavender px-2 py-1 rounded border border-primary/20 font-sans">
                          Tailored
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="max-w-7xl mx-auto w-full pt-4 flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-primary">0{activeServiceIdx + 1}</span>
              <span className="text-text-secondary">/ 03 Capabilities</span>
            </div>
            <div className="w-48 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-electric transition-all duration-200"
                style={{ width: `${((activeServiceIdx + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           MOBILE & TABLET STACK (Natural vertical touch scrolling)
           ========================================================================= */
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>WHAT WE DO</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight leading-tight mb-4">
              Three ways to move forward.
            </h2>

            <p className="text-base text-text-secondary leading-relaxed font-sans font-normal">
              Practical technology services designed around real needs and meaningful outcomes.
            </p>
          </div>

          <div className="space-y-12">
            {services.map((srv) => {
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-3xl p-6 sm:p-10 border border-border shadow-soft-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-heading font-black text-2xl text-primary">{srv.number}</span>
                    <div className="h-4 w-[1px] bg-border" />
                    <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">
                      {srv.title}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-text-main mb-3 leading-snug">
                    {srv.tagline}
                  </h3>

                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 font-sans">
                    {srv.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {srv.offerings.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-text-main font-sans">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleCta(srv.serviceType)}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    {srv.ctaText}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
