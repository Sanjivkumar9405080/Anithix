export interface ScrollFAQItem {
  id: string;
  number: string;
  shortTitle: string;
  category: string;
  question: string;
  answer: string;
  highlight: string;
  iconName: 'sparkles' | 'code' | 'bot' | 'layers' | 'graduation-cap' | 'users' | 'message-square';
}

export const scrollFaqItems: ScrollFAQItem[] = [
  {
    id: 'scroll-faq-1',
    number: '01',
    shortTitle: 'What is ANTHIX?',
    category: 'BRAND OVERVIEW',
    question: 'What is ANTHIX?',
    answer:
      'ANTHIX is an emerging technology startup specializing in Digital Solutions, AI & Automation, and Technical Training. We help organizations, startups, and institutions transform concepts into robust, scalable, and high-impact software systems.',
    highlight: 'Purpose-driven engineering • Measurable impact over hype',
    iconName: 'sparkles',
  },
  {
    id: 'scroll-faq-2',
    number: '02',
    shortTitle: 'Digital Solutions',
    category: 'CAPABILITIES',
    question: 'What digital solutions does ANTHIX offer?',
    answer:
      'We design and engineer bespoke web applications, enterprise digital platforms, modern responsive websites, and performant cloud architectures. Our engineering prioritizes clean component patterns, high performance, and long-term maintainability.',
    highlight: 'End-to-end execution • Modern React & cloud infrastructure',
    iconName: 'code',
  },
  {
    id: 'scroll-faq-3',
    number: '03',
    shortTitle: 'AI & Automation',
    category: 'INTELLIGENT WORKFLOWS',
    question: 'How can AI and automation help an organization?',
    answer:
      'We integrate intelligent workflows that eliminate repetitive manual data entry, streamline communications, and surface actionable insights. Technology operates quietly in the background so your team can focus on strategic priorities.',
    highlight: 'Zero operational friction • Deterministic custom pipelines',
    iconName: 'bot',
  },
  {
    id: 'scroll-faq-4',
    number: '04',
    shortTitle: 'Tailored Needs',
    category: 'CUSTOM ENGINEERING',
    question: 'Can solutions be tailored to specific business needs?',
    answer:
      'Every solution we build is customized. We do not use rigid off-the-shelf templates; we analyze your specific workflows, technical dependencies, and team dynamics to construct software that fits your exact operating model.',
    highlight: 'Bespoke systems • 100% aligned with your business model',
    iconName: 'layers',
  },
  {
    id: 'scroll-faq-5',
    number: '05',
    shortTitle: 'Technical Training',
    category: 'EDUCATION',
    question: 'Does ANTHIX provide technical training?',
    answer:
      'Yes. Practical technical education is a foundational pillar of ANTHIX. We deliver hands-on technical workshops, corporate upskilling programs, and college bootcamps covering modern web development, applied AI, and production cloud architecture.',
    highlight: 'Hands-on curricula • Production-ready developer skills',
    iconName: 'graduation-cap',
  },
  {
    id: 'scroll-faq-6',
    number: '06',
    shortTitle: 'Collaboration Process',
    category: 'PROCESS & TRANSPARENCY',
    question: 'How does the project collaboration process work?',
    answer:
      'We follow an open, iterative 4-stage process: Discover, Strategy, Build, and Evolve. You receive frequent prototype reviews, milestone tracking, and transparent communication from day one through post-launch refinement.',
    highlight: 'Transparent milestones • Continuous client partnership',
    iconName: 'users',
  },
  {
    id: 'scroll-faq-7',
    number: '07',
    shortTitle: 'Getting Started',
    category: 'NEXT STEPS',
    question: 'How can I get started with ANTHIX?',
    answer:
      'Reach out via our Contact form or email us directly. We will schedule a direct, jargon-free introductory discussion to explore your objectives, evaluate technical feasibility, and propose practical next steps.',
    highlight: 'Direct engineering contact • Fast introductory feasibility',
    iconName: 'message-square',
  },
];
