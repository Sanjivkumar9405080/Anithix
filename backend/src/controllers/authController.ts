import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { OtpService } from '../services/otpService';
import { EmailService } from '../services/emailService';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { OTPVerification } from '../models/OTPVerification';

const isDbReady = (res: Response): boolean => {
  if (mongoose.connection.readyState !== 1) {
    sendError(res, 'Database service is temporarily unavailable. Please try again shortly.', 503);
    return false;
  }
  return true;
};

export class AuthController {
  /**
   * POST /api/auth/register
   * Submits registration details, creates user profile immediately,
   * establishes authenticated session, and attempts optional OTP email delivery.
   */
  public static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isDbReady(res)) return;

      const { name, email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // 1. Check if user already exists
      const existingUser = await User.findOne({ email: normalizedEmail }).exec();
      if (existingUser) {
        sendError(res, 'An account with this email address already exists. Please log in.', 409);
        return;
      }

      // 2. Hash password with bcrypt (salt rounds: 12)
      const passwordHash = await AuthService.hashPassword(password);

      // 2b. Optional OTP verification if user chose to enter one during registration
      let isVerified = false;
      const cleanOtp = (req.body.otp || '').trim();
      if (cleanOtp && cleanOtp.length === 6) {
        const otpResult = await OtpService.verifyOtp(normalizedEmail, 'registration', cleanOtp);
        if (otpResult.success) {
          isVerified = true;
          await OTPVerification.deleteMany({ email: normalizedEmail, purpose: 'registration' });
        } else {
          sendError(
            res,
            otpResult.message || 'The provided verification code is invalid or has expired. Leave blank to register without OTP.',
            otpResult.statusCode || 400
          );
          return;
        }
      }

      // 3. Create full active user profile immediately
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        isEmailVerified: isVerified,
        role: 'user',
        accountStatus: 'active',
      });

      // 4. Generate token for optional API consumers
      const token = AuthService.generateToken(user);

      // 5. Optionally attempt OTP generation & email delivery if not already verified
      let otpSent = false;
      if (!isVerified) {
        try {
          const { otp } = await OtpService.createOtp(normalizedEmail, 'registration', {
            name: name.trim(),
            passwordHash,
            userId: user._id.toString(),
          });

          await EmailService.sendRegistrationOtp(normalizedEmail, name.trim(), otp);
          otpSent = true;
        } catch (otpErr: any) {
          console.warn(`[Auth Register] Optional OTP email dispatch notice for ${normalizedEmail}:`, otpErr.message);
        }
      }

      sendSuccess(
        res,
        'Registration successful! Please log in to continue.',
        {
          user: user.toSafeObject(),
          token,
          otpSent,
          email: normalizedEmail,
          purpose: 'registration',
        },
        201
      );
    } catch (error: any) {
      if (error.message?.includes('wait')) {
        sendError(res, error.message, 429);
        return;
      }
      next(error);
    }
  };

  /**
   * POST /api/auth/verify-registration-otp
   * Verifies the OTP, activates the user account, and establishes session
   */
  public static verifyRegistrationOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isDbReady(res)) return;

      const { email, otp } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // 1. Verify OTP
      const result = await OtpService.verifyOtp(normalizedEmail, 'registration', otp.trim());
      if (!result.success) {
        sendError(res, result.message, result.statusCode);
        return;
      }

      // 2. Fetch user account
      let user = await User.findOne({ email: normalizedEmail }).exec();
      if (!user) {
        const metadata = result.metadata || {};
        if (!metadata.passwordHash) {
          sendError(res, 'Registration session expired. Please register again.', 400);
          return;
        }
        user = await User.create({
          name: metadata.name || 'User',
          email: normalizedEmail,
          passwordHash: metadata.passwordHash,
          isEmailVerified: true,
          role: 'user',
          accountStatus: 'active',
        });
      } else {
        user.isEmailVerified = true;
        user.accountStatus = 'active';
        await user.save();
      }

      // 3. Clean up OTP records for this email
      await OTPVerification.deleteMany({ email: normalizedEmail, purpose: 'registration' });

      // 4. Establish authenticated session
      const token = AuthService.generateToken(user);
      AuthService.setAuthCookie(res, token);

      sendSuccess(
        res,
        'Account successfully activated and verified! Welcome to ANTHIX.',
        {
          user: user.toSafeObject(),
          token,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/login
   * Standard Email & Password authentication without requiring OTP
   */
  public static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isDbReady(res)) return;

      const { email, password } = req.body;
      const normalizedEmail = (email || '').toLowerCase().trim();

      if (!normalizedEmail || !password) {
        sendError(res, 'Email address and password are required.', 400);
        return;
      }

      // 1. Find user by email including passwordHash
      const user = await User.findOne({ email: normalizedEmail })
        .select('+passwordHash')
        .exec();

      if (!user) {
        // Generic error to prevent email enumeration
        sendError(res, 'Invalid email or password.', 401);
        return;
      }

      // 2. Verify password with bcrypt
      const isMatch = await AuthService.comparePassword(password, user.passwordHash);
      if (!isMatch) {
        sendError(res, 'Invalid email or password.', 401);
        return;
      }

      // 3. Check if account is suspended
      if (user.accountStatus === 'suspended') {
        sendError(res, 'This account is suspended. Please contact ANTHIX support.', 403);
        return;
      }

      // 4. Issue authenticated session
      const token = AuthService.generateToken(user);
      AuthService.setAuthCookie(res, token);

      sendSuccess(res, 'Logged in successfully.', {
        user: user.toSafeObject(),
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/login/request-otp (Legacy passwordless support)
   */
  public static requestLoginOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isDbReady(res)) return;

      const { email } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ email: normalizedEmail }).exec();

      if (!user) {
        sendError(
          res,
          'No registered account found with this email. Please register first.',
          404
        );
        return;
      }

      if (user.accountStatus === 'suspended') {
        sendError(res, 'This account is suspended. Please contact ANTHIX support.', 403);
        return;
      }

      const { otp } = await OtpService.createOtp(normalizedEmail, 'login', {
        userId: user._id.toString(),
      });

      try {
        await EmailService.sendLoginOtp(normalizedEmail, user.name, otp);
      } catch (emailErr: any) {
        console.error(`[Auth Request Login OTP] Email dispatch failed for ${normalizedEmail}:`, emailErr.message);
        await OTPVerification.deleteOne({ email: normalizedEmail, purpose: 'login', verified: false }).catch(() => null);
        sendError(res, emailErr.message || 'Failed to dispatch login verification code. Please try again.', 502);
        return;
      }

      sendSuccess(res, 'Login verification code sent to your email address.', {
        email: normalizedEmail,
        purpose: 'login',
      });
    } catch (error: any) {
      if (error.message?.includes('wait')) {
        sendError(res, error.message, 429);
        return;
      }
      next(error);
    }
  };

  /**
   * POST /api/auth/login/verify-otp (Legacy passwordless support)
   */
  public static verifyLoginOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isDbReady(res)) return;

      const { email, otp } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const result = await OtpService.verifyOtp(normalizedEmail, 'login', otp.trim());
      if (!result.success) {
        sendError(res, result.message, result.statusCode);
        return;
      }

      const user = await User.findOne({ email: normalizedEmail }).exec();
      if (!user) {
        sendError(res, 'User record not found.', 404);
        return;
      }

      await OTPVerification.deleteMany({ email: normalizedEmail, purpose: 'login' });

      const token = AuthService.generateToken(user);
      AuthService.setAuthCookie(res, token);

      sendSuccess(res, 'Logged in successfully.', {
        user: user.toSafeObject(),
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/resend-otp
   * Resends an eligible OTP after checking cooldown
   */
  public static resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isDbReady(res)) return;

      const { email, purpose } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      let userName = 'User';
      let metadata: Record<string, any> = {};

      if (purpose === 'login') {
        const user = await User.findOne({ email: normalizedEmail }).exec();
        if (!user) {
          sendError(res, 'No registered account found with this email.', 404);
          return;
        }
        userName = user.name;
        metadata = { userId: user._id.toString() };
      } else {
        const user = await User.findOne({ email: normalizedEmail }).exec();
        const priorRecord = await OTPVerification.findOne({
          email: normalizedEmail,
          purpose: 'registration',
        })
          .sort({ createdAt: -1 })
          .exec();

        if (!user && !priorRecord) {
          // Allow prospective user on the registration page to request an optional OTP code
          userName = (req.body.name || 'User').trim();
          metadata = { name: userName };
        } else {
          userName = user?.name || priorRecord?.metadata?.name || 'User';
          metadata = {
            name: userName,
            userId: user?._id?.toString(),
          };
        }
      }

      const { otp } = await OtpService.createOtp(normalizedEmail, purpose, metadata);

      try {
        if (purpose === 'login') {
          await EmailService.sendLoginOtp(normalizedEmail, userName, otp);
        } else {
          await EmailService.sendRegistrationOtp(normalizedEmail, userName, otp);
        }
      } catch (emailErr: any) {
        console.error(`[Auth Resend OTP] Email dispatch failed for ${normalizedEmail}:`, emailErr.message);
        await OTPVerification.deleteOne({ email: normalizedEmail, purpose, verified: false }).catch(() => null);
        sendError(res, emailErr.message || 'Failed to dispatch verification code. Please try again shortly.', 502);
        return;
      }

      sendSuccess(res, 'A new verification code has been dispatched to your email.', {
        email: normalizedEmail,
        purpose,
      });
    } catch (error: any) {
      if (error.message?.includes('wait')) {
        sendError(res, error.message, 429);
        return;
      }
      next(error);
    }
  };

  /**
   * POST /api/auth/logout
   * Clears the authentication session cookie
   */
  public static logout = async (_req: Request, res: Response): Promise<void> => {
    AuthService.clearAuthCookie(res);
    sendSuccess(res, 'Logged out successfully.');
  };

  /**
   * GET /api/auth/me
   * Returns current authenticated user profile
   */
  public static getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated', 401);
        return;
      }

      if (!isDbReady(res)) return;

      const user = await User.findById(req.user.id).exec();
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, 'Authenticated user profile retrieved.', {
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  };
}
