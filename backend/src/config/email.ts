import nodemailer, { Transporter } from 'nodemailer';
import { env, isEmailConfigured } from './env';

let transporter: Transporter | null = null;

/**
 * Initializes and returns the Nodemailer transporter.
 * In production, if SMTP is not configured, returns null to avoid silent mock false positives.
 * In development or testing, falls back to jsonTransport for safe local execution.
 */
export const getEmailTransporter = (): Transporter | null => {
  if (transporter) return transporter;

  const configured = isEmailConfigured();

  if (configured) {
    if (env.EMAIL_SERVICE === 'gmail') {
      console.log(`[Email Service] Configured Gmail SMTP Service for account: ${env.EMAIL_USER}`);
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
    } else {
      console.log(
        `[Email Service] Configured Custom SMTP Transport: ${env.EMAIL_HOST}:${env.EMAIL_PORT} (secure: ${env.EMAIL_SECURE})`
      );
      transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_SECURE,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
          rejectUnauthorized: env.NODE_ENV === 'production',
        },
      });
    }
  } else {
    if (env.NODE_ENV === 'production') {
      console.error(
        '❌ [Email Service Error]: SMTP credentials (EMAIL_USER & EMAIL_PASS) are missing in production! OTP emails cannot be delivered.'
      );
      return null;
    }

    console.log('ℹ️ [Email Service]: Running in non-production without SMTP. Using Development Mock Transporter.');
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
};

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends an email via configured transport.
 * Throws explicit descriptive errors on failure so controllers never falsely report success.
 */
export const sendMail = async (options: SendMailOptions): Promise<{ messageId: string }> => {
  const configured = isEmailConfigured();

  // In production, block sending if SMTP is not configured
  if (!configured && env.NODE_ENV === 'production') {
    console.error(
      `[Email Delivery Blocked] Cannot send email to ${options.to}: SMTP credentials are not configured in Vercel environment variables.`
    );
    throw new Error(
      'Email verification service is temporarily unavailable. Please contact the administrator to verify SMTP settings.'
    );
  }

  const mailer = getEmailTransporter();
  if (!mailer) {
    throw new Error('Email transport could not be initialized. Please check SMTP settings.');
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]+>/g, ' '),
  };

  try {
    const info = await mailer.sendMail(mailOptions);

    if (!configured && env.NODE_ENV !== 'production') {
      // In development mock mode, log confirmation
      console.log(`📨 [Dev Email Mock] To: ${options.to} | Subject: "${options.subject}"`);
    }

    return { messageId: info.messageId || 'mock-id' };
  } catch (error: any) {
    const safeErrorDetails = {
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      message: error?.message,
    };
    console.error(`[Email Delivery Failure] Failed to send email to ${options.to}:`, safeErrorDetails);

    if (error?.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed (EAUTH). If using Gmail, please ensure a 16-character Google App Password is used instead of your regular password.'
      );
    }

    if (error?.code === 'ETIMEDOUT' || error?.code === 'ESOCKET') {
      throw new Error(
        'Email connection timed out. Please check SMTP host/port settings or firewall restrictions.'
      );
    }

    if (error?.code === 'EENVELOPE') {
      throw new Error('Invalid recipient email address format.');
    }

    throw new Error(error?.message || 'Email delivery failed. Please verify email provider credentials or try again later.');
  }
};
