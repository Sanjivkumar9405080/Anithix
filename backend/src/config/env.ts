import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface AppEnv {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  MONGODB_URI: string;
  CLIENT_URL: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE_NAME: string;
  EMAIL_SERVICE?: string;
  EMAIL_HOST?: string;
  EMAIL_PORT: number;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  EMAIL_SECURE: boolean;
  EMAIL_FROM: string;
  OTP_EXPIRY_MINUTES: number;
  OTP_MAX_ATTEMPTS: number;
  OTP_RESEND_COOLDOWN_SECONDS: number;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  CLOUDINARY_URL?: string;
  ALLOW_VERCEL_PREVIEWS: boolean;
}

const isProduction = process.env.NODE_ENV === 'production';

// Resolve email credentials with support for common aliases across Vercel / Netlify / cloud hosts
const resolvedEmailUser =
  process.env.EMAIL_USER ||
  process.env.SMTP_USER ||
  process.env.SMTP_USERNAME ||
  process.env.EMAIL_USERNAME;

const resolvedEmailPass =
  process.env.EMAIL_PASS ||
  process.env.EMAIL_PASSWORD ||
  process.env.SMTP_PASS ||
  process.env.SMTP_PASSWORD;

const rawHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
const rawService = process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE;
const isGmailService =
  Boolean(rawService && rawService.toLowerCase() === 'gmail') ||
  Boolean(rawHost && rawHost.toLowerCase().includes('gmail'));

const resolvedEmailHost = rawHost || (isGmailService ? 'smtp.gmail.com' : undefined);
const resolvedEmailService = rawService || (isGmailService ? 'gmail' : undefined);

const defaultPort = isGmailService ? '465' : '587';
const resolvedEmailPort = parseInt(
  process.env.EMAIL_PORT || process.env.SMTP_PORT || defaultPort,
  10
);

const resolvedEmailSecure =
  process.env.SMTP_SECURE === 'true' ||
  process.env.EMAIL_SECURE === 'true' ||
  resolvedEmailPort === 465;

const resolvedEmailFrom =
  process.env.EMAIL_FROM ||
  process.env.SMTP_FROM ||
  (resolvedEmailUser ? `ANTHIX Security <${resolvedEmailUser}>` : 'ANTHIX Security <no-reply@anthix.com>');

export const env: AppEnv = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anthix',
  CLIENT_URL: (process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  FRONTEND_URL: (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
  JWT_SECRET: process.env.JWT_SECRET || process.env.SESSION_SECRET || 'anthix_super_secret_jwt_key_2026_dev_fallback',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'anthix_session',
  EMAIL_SERVICE: resolvedEmailService,
  EMAIL_HOST: resolvedEmailHost,
  EMAIL_PORT: resolvedEmailPort,
  EMAIL_USER: resolvedEmailUser,
  EMAIL_PASS: resolvedEmailPass,
  EMAIL_SECURE: resolvedEmailSecure,
  EMAIL_FROM: resolvedEmailFrom,
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
  OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
  OTP_RESEND_COOLDOWN_SECONDS: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  ALLOW_VERCEL_PREVIEWS: process.env.ALLOW_VERCEL_PREVIEWS === 'true' || !isProduction,
};

export const isEmailConfigured = (): boolean => {
  return Boolean(env.EMAIL_USER && env.EMAIL_PASS && (env.EMAIL_SERVICE || env.EMAIL_HOST));
};

if (isProduction && (!process.env.JWT_SECRET && !process.env.SESSION_SECRET)) {
  console.warn('⚠️ [SECURITY WARNING]: Running in production without a custom JWT_SECRET or SESSION_SECRET!');
}
