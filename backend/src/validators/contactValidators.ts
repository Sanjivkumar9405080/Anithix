import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(150, 'Email cannot exceed 150 characters')
    .optional(),
  service: z
    .string({ required_error: 'Service of interest is required' })
    .trim()
    .min(2, 'Service name must be specified')
    .max(100, 'Service cannot exceed 100 characters'),
  organization: z
    .string()
    .trim()
    .max(150, 'Organization name cannot exceed 150 characters')
    .optional()
    .default(''),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number cannot exceed 30 characters')
    .optional()
    .default(''),
  subject: z
    .string()
    .trim()
    .max(200, 'Subject cannot exceed 200 characters')
    .optional()
    .default('Project Inquiry'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters long')
    .max(3000, 'Message cannot exceed 3000 characters'),
});
