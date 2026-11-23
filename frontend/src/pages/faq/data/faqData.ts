export type FAQCategory = 
  | 'all' 
  | 'general' 
  | 'digital-solutions' 
  | 'ai-automation' 
  | 'technical-training' 
  | 'projects';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  categoryLabel: string;
  question: string;
  answer: string;
}

export const faqCategories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'digital-solutions', label: 'Digital Solutions' },
  { id: 'ai-automation', label: 'AI & Automation' },
  { id: 'technical-training', label: 'Technical Training' },
  { id: 'projects', label: 'Projects' },
] as const;

export const faqData: FAQItem[] = [
  // GENERAL
  {
    id: 'faq-1',
    category: 'general',
    categoryLabel: 'General',
    question: 'What is ANTHIX?',
    answer:
      'ANTHIX is an emerging technology startup focused on Digital Solutions, AI & Automation, and Technical Training. We help businesses, startups, and institutions transform ideas into practical, reliable, and high-impact digital outcomes.',
  },
  {
    id: 'faq-2',
    category: 'general',
    categoryLabel: 'General',
    question: 'What services does ANTHIX offer?',
    answer:
      'We operate across three core focus areas: modern web & digital development (websites, custom web apps, UI/UX systems), AI & workflow automation (intelligent pipelines, smart assistants, task automation), and hands-on technical training for universities, teams, and students.',
  },
  {
    id: 'faq-3',
    category: 'general',
    categoryLabel: 'General',
    question: 'Who can work with ANTHIX?',
    answer:
      'We collaborate with forward-thinking businesses, early-stage startups, educational institutions, colleges, and enterprise teams seeking purposeful engineering, modern user interfaces, and practical AI implementations.',
  },
  {
    id: 'faq-4',
    category: 'general',
    categoryLabel: 'General',
    question: 'How do I get started with ANTHIX?',
    answer:
      'You can reach out through our Contact page. Share a summary of your goals, current challenges, or ideas, and our engineering team will get in touch directly to discuss your requirements and outline a sensible starting point.',
  },

  // DIGITAL SOLUTIONS
  {
    id: 'faq-5',
    category: 'digital-solutions',
    categoryLabel: 'Digital Solutions',
    question: 'Can ANTHIX help build a website or web application?',
    answer:
      'Yes. We design and build bespoke, responsive websites and cloud-native web applications tailored to your specific workflows and audience. We prioritize clean component architecture, search visibility, sub-second load times, and accessibility.',
  },
  {
    id: 'faq-6',
    category: 'digital-solutions',
    categoryLabel: 'Digital Solutions',
    question: 'Can you develop custom digital solutions for an organization?',
    answer:
      'Absolutely. Every organization operates differently. We design tailor-made digital portals, dashboard interfaces, internal tools, and client platforms engineered around your specific operational requirements and infrastructure.',
  },
  {
    id: 'faq-7',
    category: 'digital-solutions',
    categoryLabel: 'Digital Solutions',
    question: 'Can you help improve an existing digital product?',
    answer:
      'Yes. We conduct architectural, UX, and performance audits on existing platforms to identify bottlenecks, modernize legacy codebases, refactor user flows, and optimize responsive speed without disrupting active operations.',
  },

  // AI & AUTOMATION
  {
    id: 'faq-8',
    category: 'ai-automation',
    categoryLabel: 'AI & Automation',
    question: 'How can AI and automation help my business?',
    answer:
      'AI and targeted automation eliminate repetitive manual tasks, accelerate document and data synthesis, synchronize disparate software systems, and provide context-aware insights, enabling your team to focus on higher-value decisions.',
  },
  {
    id: 'faq-9',
    category: 'ai-automation',
    categoryLabel: 'AI & Automation',
    question: 'Can AI be integrated into an existing workflow?',
    answer:
      'Yes. Rather than forcing you to abandon current tools, we construct deterministic API conduits and webhook pipelines that integrate language models and automations seamlessly into your existing CRM, database, or communications stack.',
  },
  {
    id: 'faq-10',
    category: 'ai-automation',
    categoryLabel: 'AI & Automation',
    question: 'Do I need technical knowledge to use AI solutions?',
    answer:
      'Not at all. We design our AI applications and automated pipelines with intuitive, human-centered interfaces. The underlying technical orchestration operates reliably in the background, allowing your team to use them naturally without specialized technical skills.',
  },

  // TECHNICAL TRAINING
  {
    id: 'faq-11',
    category: 'technical-training',
    categoryLabel: 'Technical Training',
    question: 'Does ANTHIX provide technical training?',
    answer:
      'Yes. Practical technical education is a foundational pillar of ANTHIX. We provide hands-on workshops, developer sprints, and structured bootcamps designed to build production-grade software development and AI engineering skills.',
  },
  {
    id: 'faq-12',
    category: 'technical-training',
    categoryLabel: 'Technical Training',
    question: 'Can training be tailored for schools, colleges, and organizations?',
    answer:
      'Yes. We calibrate each program to match your learners’ current proficiency, time constraints, and institutional goals—ranging from fundamental programming workshops to advanced full-stack and applied AI modules.',
  },
  {
    id: 'faq-13',
    category: 'technical-training',
    categoryLabel: 'Technical Training',
    question: 'What technologies or skills can be covered?',
    answer:
      'Our curriculum covers modern web engineering (React, TypeScript, Node.js), responsive design systems (Tailwind CSS), API architecture, prompt engineering, agentic AI workflows, git collaboration, and production deployment best practices.',
  },

  // PROJECTS & COLLABORATION
  {
    id: 'faq-14',
    category: 'projects',
    categoryLabel: 'Projects',
    question: 'How does the project process work?',
    answer:
      'We follow a disciplined 4-stage methodology: Discover (listening and constraint mapping), Plan (architectural blueprints and phased milestones), Build (iterative development and active previews), and Evolve (monitoring outcomes and continuous refinement).',
  },
  {
    id: 'faq-15',
    category: 'projects',
    categoryLabel: 'Projects',
    question: 'How are project scope and timelines decided?',
    answer:
      'Scope and delivery milestones are established transparently before work commences. We evaluate your core must-haves, technical dependencies, and priorities to create a realistic, phased roadmap with clear deliverables.',
  },
  {
    id: 'faq-16',
    category: 'projects',
    categoryLabel: 'Projects',
    question: 'How can I discuss my project with ANTHIX?',
    answer:
      'Submit an inquiry via our Contact form or email us directly. We will schedule a direct, jargon-free introductory consultation to discuss your vision, evaluate feasibility, and recommend pragmatic next steps.',
  },
];
