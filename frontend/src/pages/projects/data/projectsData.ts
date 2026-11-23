export interface ProjectCardData {
  id: string;
  number: string;
  category: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  entryDirection: 'left' | 'right';
  mockupType: 'crm' | 'school' | 'hospital' | 'blood-donation' | 'ecommerce' | 'ai-workflow';
  surfaceTheme: 'violet-lavender' | 'soft-blue' | 'white-blue' | 'coral-lavender' | 'soft-lavender' | 'pale-sky';
}

export const projectCardsData: ProjectCardData[] = [
  {
    id: 'project-crm',
    number: '01',
    category: 'Business Software',
    badge: 'Project Concept',
    title: 'CRM & Business Management System',
    description: 'A centralized workspace concept for customer relationships, sales pipelines, tasks, and business operations.',
    tags: ['Leads', 'Sales Pipeline', 'Analytics', 'Tasks'],
    entryDirection: 'left',
    mockupType: 'crm',
    surfaceTheme: 'violet-lavender',
  },
  {
    id: 'project-school',
    number: '02',
    category: 'Education Technology',
    badge: 'Project Concept',
    title: 'School Management System',
    description: 'A unified platform concept for student records, attendance, timetables, fees, and school administration.',
    tags: ['Students', 'Attendance', 'Timetable', 'Fees'],
    entryDirection: 'right',
    mockupType: 'school',
    surfaceTheme: 'soft-blue',
  },
  {
    id: 'project-hospital',
    number: '03',
    category: 'Healthcare Technology',
    badge: 'Project Concept',
    title: 'Hospital Management System',
    description: 'A healthcare administration concept for appointments, patient registration, staff coordination, and operational workflows.',
    tags: ['Appointments', 'Departments', 'Administration', 'Reports'],
    entryDirection: 'left',
    mockupType: 'hospital',
    surfaceTheme: 'white-blue',
  },
  {
    id: 'project-blood-donation',
    number: '04',
    category: 'Social Impact Technology',
    badge: 'Project Concept',
    title: 'Blood Donation Platform',
    description: 'A community platform concept for donor registration, blood group filtering, donation requests, and coordination.',
    tags: ['Donors', 'Blood Groups', 'Requests', 'Donation Camps'],
    entryDirection: 'right',
    mockupType: 'blood-donation',
    surfaceTheme: 'coral-lavender',
  },
  {
    id: 'project-ecommerce',
    number: '05',
    category: 'Commerce Technology',
    badge: 'Project Concept',
    title: 'E-Commerce & Inventory Platform',
    description: 'A commerce platform concept for product catalogs, order management, inventory, and customer interactions.',
    tags: ['Products', 'Orders', 'Inventory', 'Analytics'],
    entryDirection: 'left',
    mockupType: 'ecommerce',
    surfaceTheme: 'soft-lavender',
  },
  {
    id: 'project-ai-automation',
    number: '06',
    category: 'AI & Automation',
    badge: 'Project Concept',
    title: 'AI & Workflow Automation',
    description: 'A workflow automation concept for connecting repetitive tasks, business processes, notifications, and integrations.',
    tags: ['Workflows', 'Integrations', 'Triggers', 'Automation'],
    entryDirection: 'right',
    mockupType: 'ai-workflow',
    surfaceTheme: 'pale-sky',
  },
];

export interface ProjectCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tags: string[];
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'cat-business-crm',
    title: 'Business & CRM Solutions',
    description: 'Custom lead pipelines, customer relationship portals, and operational management systems designed around your workflow.',
    iconName: 'briefcase',
    tags: ['Sales Pipeline', 'Lead Tracking', 'Task Management'],
  },
  {
    id: 'cat-edtech',
    title: 'Education Technology',
    description: 'Student information systems, school administration dashboards, timetable managers, and learning portals.',
    iconName: 'graduation-cap',
    tags: ['Attendance', 'Timetables', 'Student Records'],
  },
  {
    id: 'cat-healthcare',
    title: 'Healthcare Administration',
    description: 'Clinic appointment systems, triage workflows, staff schedules, and capacity monitoring platforms.',
    iconName: 'activity',
    tags: ['Appointments', 'Triage', 'Roster Management'],
  },
  {
    id: 'cat-social-impact',
    title: 'Social Impact Platforms',
    description: 'Community coordination tools, donor matching systems, volunteer directories, and public welfare portals.',
    iconName: 'heart',
    tags: ['Donor Match', 'Community', 'Public Good'],
  },
  {
    id: 'cat-ecommerce',
    title: 'E-Commerce & Digital Platforms',
    description: 'Modern digital storefronts, customized checkout flows, product catalogs, and integrated inventory management.',
    iconName: 'shopping-bag',
    tags: ['Storefront', 'Inventory', 'Order Fulfillment'],
  },
  {
    id: 'cat-ai-automation',
    title: 'AI & Workflow Automation',
    description: 'Intelligent document parsers, deterministic API pipelines, smart notification bots, and automated task routing.',
    iconName: 'bot',
    tags: ['LLM Workflows', 'Webhooks', 'Process Optimization'],
  },
  {
    id: 'cat-web-apps',
    title: 'Custom Websites & Web Applications',
    description: 'High-performance cloud-native web applications, marketing sites, and bespoke customer portals.',
    iconName: 'globe',
    tags: ['React', 'TypeScript', 'Responsive Design'],
  },
  {
    id: 'cat-internal-tools',
    title: 'Internal Tools & Admin Dashboards',
    description: 'Custom back-office control panels, operational databases, analytics dashboards, and role-based access consoles.',
    iconName: 'layout-dashboard',
    tags: ['Data Analytics', 'Role Permissions', 'Auditing'],
  },
];

export const anthixCapabilities = [
  {
    title: 'Website Design & Development',
    description: 'Modern, fast, accessible websites built with clean code and high aesthetic polish.',
  },
  {
    title: 'Custom Web Applications',
    description: 'Bespoke full-stack web applications tailored to specific business operations.',
  },
  {
    title: 'CRM & Business Software',
    description: 'Centralized customer tracking, sales workflows, and team task management.',
  },
  {
    title: 'School & Education Platforms',
    description: 'Academic administration, student records, timetable engines, and portals.',
  },
  {
    title: 'Healthcare Administration Software',
    description: 'Appointment scheduling, patient workflow coordination, and clinic rosters.',
  },
  {
    title: 'E-Commerce Solutions',
    description: 'Product storefronts, custom checkout experiences, and inventory tracking.',
  },
  {
    title: 'AI Integration & Automation',
    description: 'Workflow automation, intelligent data synthesis, and task elimination.',
  },
  {
    title: 'API & Third-Party Integrations',
    description: 'Connecting disparate SaaS tools, payment gateways, and databases via secure APIs.',
  },
  {
    title: 'Admin Dashboards & Reporting',
    description: 'Real-time operational metrics, interactive data visualizations, and export tools.',
  },
  {
    title: 'Technical Training & Workshops',
    description: 'Hands-on developer workshops and bootcamps for student and corporate teams.',
  },
  {
    title: 'Software Maintenance & Iteration',
    description: 'Long-term code refinement, security audits, and measured product evolution.',
  },
];
