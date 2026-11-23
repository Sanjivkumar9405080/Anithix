import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { authRateLimiter, otpRateLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  verifyRegistrationOtpSchema,
  loginSchema,
  requestLoginOtpSchema,
  verifyLoginOtpSchema,
  resendOtpSchema,
} from '../validators/authValidators';

const router = Router();

// Registration Flow (with Email OTP)
router.post(
  '/register',
  authRateLimiter,
  validateRequest(registerSchema),
  AuthController.register
);

router.post(
  '/verify-registration-otp',
  otpRateLimiter,
  validateRequest(verifyRegistrationOtpSchema),
  AuthController.verifyRegistrationOtp
);

// Standard Login Flow (Email & Password, No OTP)
router.post(
  '/login',
  authRateLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

// Legacy Passwordless Login Flow
router.post(
  '/login/request-otp',
  authRateLimiter,
  validateRequest(requestLoginOtpSchema),
  AuthController.requestLoginOtp
);

router.post(
  '/login/verify-otp',
  otpRateLimiter,
  validateRequest(verifyLoginOtpSchema),
  AuthController.verifyLoginOtp
);

// Resend OTP (Rate limited & cooldown enforced)
router.post(
  '/resend-otp',
  authRateLimiter,
  validateRequest(resendOtpSchema),
  AuthController.resendOtp
);

// Session Management
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;
