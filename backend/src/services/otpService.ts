import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { OTPVerification, OtpPurpose } from '../models/OTPVerification';
import { env } from '../config/env';

export interface GeneratedOtpResult {
  otp: string;
  expiresAt: Date;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  metadata?: Record<string, any>;
  statusCode: number;
}

export class OtpService {
  /**
   * Generates a cryptographically secure 6-digit OTP string
   */
  public static generateSecureOtp(): string {
    const min = 100000;
    const max = 1000000;
    return crypto.randomInt(min, max).toString();
  }

  /**
   * Hashes the plaintext OTP using bcrypt
   */
  public static async hashOtp(otp: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(otp, saltRounds);
  }

  /**
   * Checks whether the user must wait before requesting another OTP
   */
  public static async checkCooldown(email: string, purpose: OtpPurpose): Promise<{ inCooldown: boolean; remainingSeconds: number }> {
    const latestOtp = await OTPVerification.findOne({ email, purpose })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestOtp) {
      return { inCooldown: false, remainingSeconds: 0 };
    }

    const elapsedSeconds = Math.floor((Date.now() - latestOtp.createdAt.getTime()) / 1000);
    const cooldownDuration = env.OTP_RESEND_COOLDOWN_SECONDS;

    if (elapsedSeconds < cooldownDuration) {
      return {
        inCooldown: true,
        remainingSeconds: cooldownDuration - elapsedSeconds,
      };
    }

    return { inCooldown: false, remainingSeconds: 0 };
  }

  /**
   * Creates a new OTP record, invalidating any previous active OTP for the same email and purpose
   */
  public static async createOtp(
    email: string,
    purpose: OtpPurpose,
    metadata: Record<string, any> = {}
  ): Promise<GeneratedOtpResult> {
    // 1. Verify cooldown
    const { inCooldown, remainingSeconds } = await this.checkCooldown(email, purpose);
    if (inCooldown) {
      throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new OTP.`);
    }

    // 2. Invalidate previous active unverified OTPs
    await OTPVerification.deleteMany({ email, purpose, verified: false });

    // 3. Generate 6-digit OTP
    const otp = this.generateSecureOtp();
    const otpHash = await this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    // 4. Save to database
    await OTPVerification.create({
      email,
      otpHash,
      purpose,
      metadata,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    if (env.NODE_ENV !== 'production') {
      console.log(`🔑 [DEV OTP GENERATED] To: ${email} | Purpose: ${purpose} | Code: ${otp} | Expires in: ${env.OTP_EXPIRY_MINUTES}m`);
    }

    return { otp, expiresAt };
  }

  /**
   * Verifies the submitted OTP against the active record
   */
  public static async verifyOtp(
    email: string,
    purpose: OtpPurpose,
    submittedOtp: string
  ): Promise<VerifyOtpResult> {
    // Find latest active OTP
    const record = await OTPVerification.findOne({
      email,
      purpose,
      verified: false,
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!record) {
      return {
        success: false,
        message: 'No active OTP verification found. Please request a new code.',
        statusCode: 400,
      };
    }

    // Check expiration
    if (new Date() > record.expiresAt) {
      await OTPVerification.deleteOne({ _id: record._id });
      return {
        success: false,
        message: 'OTP has expired. Please request a fresh code.',
        statusCode: 400,
      };
    }

    // Check attempts limit
    if (record.attempts >= env.OTP_MAX_ATTEMPTS) {
      await OTPVerification.deleteOne({ _id: record._id });
      return {
        success: false,
        message: 'Maximum OTP verification attempts exceeded. Please request a new code.',
        statusCode: 429,
      };
    }

    // Increment attempts
    record.attempts += 1;

    // Compare hash
    const isMatch = await bcrypt.compare(submittedOtp, record.otpHash);
    if (!isMatch) {
      await record.save();
      const remainingAttempts = env.OTP_MAX_ATTEMPTS - record.attempts;
      return {
        success: false,
        message: `Incorrect OTP code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Code invalidated.'}`,
        statusCode: 400,
      };
    }

    // Mark as verified single-use
    record.verified = true;
    await record.save();

    return {
      success: true,
      message: 'OTP verified successfully.',
      metadata: record.metadata,
      statusCode: 200,
    };
  }
}
