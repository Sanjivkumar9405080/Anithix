export type ServiceType = 
  | 'Digital Solutions'
  | 'AI & Automation'
  | 'Technical Training'
  | 'Other / Not Sure Yet';

export interface ContactFormData {
  fullName: string;
  email: string;
  organization: string;
  service: ServiceType;
  message: string;
}
