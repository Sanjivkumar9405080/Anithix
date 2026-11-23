import { sendMail } from '../config/email';
import { env } from '../config/env';

export class EmailService {
  /**
   * Generates standard ANTHIX-branded HTML email template
   */
  private static renderEmailTemplate(title: string, greeting: string, bodyContent: string, otpCode: string, expiryMinutes: number): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F8FC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #171923;
    }
    .wrapper {
      width: 100%;
      background-color: #F7F8FC;
      padding: 40px 15px;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20px;
      border: 1px solid #E8EAF2;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #635BFF 0%, #5145E5 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .brand-name {
      color: #FFFFFF;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-tagline {
      color: rgba(255, 255, 255, 0.8);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 4px;
      font-weight: 600;
    }
    .content {
      padding: 36px 30px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      color: #171923;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .greeting {
      font-size: 15px;
      line-height: 1.6;
      color: #667085;
      margin-bottom: 24px;
    }
    .otp-box {
      background-color: #F0EDFF;
      border: 1px dashed #635BFF;
      border-radius: 14px;
      padding: 22px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-code {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #635BFF;
      font-family: 'Courier New', Courier, monospace;
      margin: 0;
    }
    .otp-subtext {
      font-size: 12px;
      color: #5145E5;
      margin-top: 8px;
      font-weight: 600;
    }
    .warning-box {
      background-color: #FFFBEB;
      border-left: 4px solid #F59E0B;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      color: #92400E;
      margin-top: 24px;
      line-height: 1.5;
    }
    .footer {
      background-color: #F7F8FC;
      border-top: 1px solid #E8EAF2;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #667085;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-name">ANTHIX</h1>
        <div class="brand-tagline">Ideas Into Impact</div>
      </div>
      <div class="content">
        <h2 class="title">${title}</h2>
        <p class="greeting">${greeting}</p>
        <p style="font-size: 14px; color: #4A5568; line-height: 1.5;">${bodyContent}</p>

        <div class="otp-box">
          <div class="otp-code">${otpCode}</div>
          <div class="otp-subtext">Valid for ${expiryMinutes} minutes</div>
        </div>

        <div class="warning-box">
          <strong>Security Notice:</strong> ANTHIX engineers will never ask for your verification code. If you did not request this, please disregard this email.
        </div>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} ANTHIX Technology. All rights reserved.<br>
        Direct Engineering & Digital Solutions.
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Sends Registration OTP Verification Email
   */
  public static async sendRegistrationOtp(email: string, name: string, otp: string): Promise<void> {
    const title = 'Verify Your Email Address';
    const greeting = `Hello ${name || 'there'},`;
    const body = `Thank you for signing up with ANTHIX. Please use the following 6-digit One-Time Password (OTP) to activate your account and access our secure services.`;

    const html = this.renderEmailTemplate(title, greeting, body, otp, env.OTP_EXPIRY_MINUTES);
    const text = `ANTHIX Registration Code: ${otp}\nValid for ${env.OTP_EXPIRY_MINUTES} minutes.\nNever share this code with anyone.`;

    await sendMail({
      to: email,
      subject: `Your ANTHIX Registration Verification Code: ${otp}`,
      html,
      text,
    });
  }

  /**
   * Sends Login OTP Verification Email
   */
  public static async sendLoginOtp(email: string, name: string, otp: string): Promise<void> {
    const title = 'Your Login Verification Code';
    const greeting = `Welcome back, ${name || 'there'}!`;
    const body = `We received a request to log into your ANTHIX account. Enter the 6-digit verification code below to complete your sign-in:`;

    const html = this.renderEmailTemplate(title, greeting, body, otp, env.OTP_EXPIRY_MINUTES);
    const text = `ANTHIX Login Code: ${otp}\nValid for ${env.OTP_EXPIRY_MINUTES} minutes.\nNever share this code with anyone.`;

    await sendMail({
      to: email,
      subject: `Your ANTHIX Login Verification Code: ${otp}`,
      html,
      text,
    });
  }

  /**
   * Sends custom client email from the Admin Dashboard
   */
  public static async sendCustomEmail(
    to: string,
    recipientName: string,
    subject: string,
    body: string
  ): Promise<{ messageId: string }> {
    const formattedBody = body
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br />');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F7F8FC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171923; }
    .wrapper { width: 100%; background-color: #F7F8FC; padding: 40px 15px; }
    .container { max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E8EAF2; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #635BFF 0%, #5145E5 100%); padding: 30px 24px; text-align: center; }
    .brand-name { color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .brand-tagline { color: rgba(255, 255, 255, 0.85); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: 600; }
    .content { padding: 36px 30px; font-size: 15px; line-height: 1.7; color: #171923; }
    .body-content { margin-top: 8px; }
    .footer { background-color: #FAFAFD; padding: 22px; text-align: center; border-top: 1px solid #E8EAF2; font-size: 12px; color: #667085; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-name">ANTHIX</h1>
        <div class="brand-tagline">Ideas Into Impact</div>
      </div>
      <div class="content">
        ${recipientName ? `<p>Hello <strong>${recipientName}</strong>,</p>` : ''}
        <div class="body-content">${formattedBody}</div>
      </div>
      <div class="footer">
        <p style="margin: 0 0 4px 0;"><strong>ANTHIX Technology Solutions</strong></p>
        <p style="margin: 0;">This communication was sent by the ANTHIX Administrative Team.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

    return sendMail({
      to,
      subject,
      html,
      text: body,
    });
  }
}
