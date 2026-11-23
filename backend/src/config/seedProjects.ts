import { Project } from '../models/Project';

export const initialProjectsData = [
  {
    title: 'CRM & Business Management System',
    slug: 'crm-business-management-system',
    shortDescription: 'A centralized workspace concept for customer relationships, sales pipelines, tasks, and business operations.',
    description: 'An enterprise-grade CRM and operations management platform featuring real-time lead ingestion, customizable deal stages, customer communication logging, dynamic sales reporting, and automated team task assignment.',
    category: 'Business Software',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    ],
    liveDemoUrl: 'https://anthix.com/demo/crm',
    sourceCodeUrl: '',
    featured: true,
    status: 'published' as const,
    order: 1,
    mockupType: 'crm',
    surfaceTheme: 'violet-lavender',
    badge: 'Enterprise Solution',
  },
  {
    title: 'School Management System',
    slug: 'school-management-system',
    shortDescription: 'A unified platform concept for student records, attendance, timetables, fees, and school administration.',
    description: 'Comprehensive academic institution software coordinating student profiles, parent communication portals, automated fee invoice generation, real-time biometric or manual attendance tracking, and grading analytics.',
    category: 'Education Technology',
    technologies: ['React', 'Next.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    ],
    liveDemoUrl: 'https://anthix.com/demo/school',
    sourceCodeUrl: '',
    featured: true,
    status: 'published' as const,
    order: 2,
    mockupType: 'school',
    surfaceTheme: 'soft-blue',
    badge: 'Education Tech',
  },
  {
    title: 'Hospital Management System',
    slug: 'hospital-management-system',
    shortDescription: 'A healthcare administration concept for appointments, patient registration, staff coordination, and operational workflows.',
    description: 'HIPAA-compliant hospital portal facilitating patient check-ins, electronic health records (EHR), OPD appointment scheduling, in-patient bed management, laboratory test result dispatch, and duty roster automation.',
    category: 'Healthcare Technology',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    ],
    liveDemoUrl: 'https://anthix.com/demo/hospital',
    sourceCodeUrl: '',
    featured: true,
    status: 'published' as const,
    order: 3,
    mockupType: 'hospital',
    surfaceTheme: 'white-blue',
    badge: 'Healthcare Tech',
  },
  {
    title: 'Blood Donation Platform',
    slug: 'blood-donation-platform',
    shortDescription: 'A community platform concept for donor registration, blood group filtering, donation requests, and coordination.',
    description: 'A life-saving public health network connecting regional blood banks, volunteer donors, and emergency hospital requests with geofenced SMS notifications and real-time inventory levels.',
    category: 'Social Impact Technology',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'WebSockets', 'Tailwind CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    ],
    liveDemoUrl: 'https://anthix.com/demo/blood-donation',
    sourceCodeUrl: '',
    featured: true,
    status: 'published' as const,
    order: 4,
    mockupType: 'blood-donation',
    surfaceTheme: 'coral-lavender',
    badge: 'Social Impact',
  },
  {
    title: 'E-Commerce & Inventory Platform',
    slug: 'ecommerce-inventory-platform',
    shortDescription: 'A commerce platform concept for product catalogs, order management, inventory, and customer interactions.',
    description: 'High-conversion multi-channel storefront with automated warehouse stock synchronization, integrated Stripe checkout, real-time shipment tracking, coupon engine, and customer support portal.',
    category: 'Commerce Technology',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Stripe'],
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    ],
    liveDemoUrl: 'https://anthix.com/demo/ecommerce',
    sourceCodeUrl: '',
    featured: true,
    status: 'published' as const,
    order: 5,
    mockupType: 'ecommerce',
    surfaceTheme: 'soft-lavender',
    badge: 'Digital Commerce',
  },
  {
    title: 'AI & Workflow Automation',
    slug: 'ai-workflow-automation',
    shortDescription: 'A workflow automation concept for connecting repetitive tasks, business processes, notifications, and integrations.',
    description: 'Custom AI agent orchestrator streamlining CRM lead enrichment, automated email categorization, document summarization with LLMs, and multi-step webhook dispatch between cloud tools.',
    category: 'AI & Automation',
    technologies: ['Python', 'FastAPI', 'React', 'LangChain', 'OpenAI'],
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    ],
    liveDemoUrl: 'https://anthix.com/demo/ai-workflow',
    sourceCodeUrl: '',
    featured: true,
    status: 'published' as const,
    order: 6,
    mockupType: 'ai-workflow',
    surfaceTheme: 'pale-sky',
    badge: 'AI & Automation',
  },
];

export async function seedInitialProjects(): Promise<void> {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding initial project catalog into MongoDB...');
      await Project.insertMany(initialProjectsData);
      console.log(`[Seed] Successfully seeded ${initialProjectsData.length} projects into MongoDB.`);
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial projects:', error);
  }
}
