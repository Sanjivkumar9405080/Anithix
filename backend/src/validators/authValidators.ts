import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({ required_error: 'Email address is required' })
      .trim()
      .email('Please provide a valid email address')
      .max(150, 'Email cannot exceed 150 characters')
      .transform((val) => val.toLowerCase()),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one digit'),
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
    otp: z
      .string()
      .trim()
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(150, 'Email cannot exceed 150 characters')
    .transform((val) => val.toLowerCase()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const verifyRegistrationOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .transform((val) => val.toLowerCase()),
  otp: z
    .string({ required_error: 'OTP code is required' })
    .trim()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit number'),
});

export const requestLoginOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .transform((val) => val.toLowerCase()),
});

export const verifyLoginOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .transform((val) => val.toLowerCase()),
  otp: z
    .string({ required_error: 'OTP code is required' })
    .trim()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit number'),
});

export const resendOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .transform((val) => val.toLowerCase()),
  purpose: z.enum(['registration', 'login'], {
    required_error: 'Valid OTP purpose (registration or login) is required',
  }),
  name: z.string().trim().max(100).optional(),
});
