import nodemailer, { Transporter } from 'nodemailer';
import { env } from './env';

let transporter: Transporter | null = null;

/**
 * Initializes and returns the Nodemailer transporter
 */
export const getEmailTransporter = (): Transporter => {
  if (transporter) return transporter;

  const hasSmtpConfig = Boolean(env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASS);

  if (hasSmtpConfig) {
    console.log(`[Email Service] Configured SMTP Transport with host: ${env.EMAIL_HOST}:${env.EMAIL_PORT}`);
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_PORT === 465,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  } else {
    if (env.NODE_ENV === 'production') {
      console.error('❌ [Email Service Error]: SMTP credentials missing in production environment!');
    } else {
      console.log('ℹ️ [Email Service]: No SMTP credentials configured. Using Development Mock Transporter.');
    }

    // Mock transporter for development / test environments
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
 * Sends an email via configured transport
 */
export const sendMail = async (options: SendMailOptions): Promise<{ messageId: string }> => {
  const mailer = getEmailTransporter();
  const hasSmtpConfig = Boolean(env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASS);

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]+>/g, ' '),
  };

  try {
    const info = await mailer.sendMail(mailOptions);

    if (!hasSmtpConfig && env.NODE_ENV !== 'production') {
      // In development mock mode, log confirmation
      console.log(`📨 [Dev Email Mock] To: ${options.to} | Subject: "${options.subject}"`);
    }

    return { messageId: info.messageId || 'mock-id' };
  } catch (error) {
    console.error(`[Email Delivery Failure] Failed to send email to ${options.to}:`, error);
    throw new Error('Email delivery failed. Please verify email provider credentials or try again later.');
  }
};
