import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { KeyRound, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const VerifyOtp: React.FC = () => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState<number>(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyRegistrationOtp, verifyLoginOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  const purpose = (searchParams.get('purpose') as 'registration' | 'login') || 'registration';
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric character
    const sanitized = value.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = sanitized;
    setDigits(newDigits);
    if (error) setError(null);

    // Auto advance to next box
    if (sanitized && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setDigits(newDigits);
      if (error) setError(null);

      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = digits.join('').trim();

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of your One-Time Password.');
      return;
    }

    if (!email) {
      setError('Missing recipient email. Please start the process again.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    let res;
    if (purpose === 'registration') {
      res = await verifyRegistrationOtp({ email, otp: otpCode });
    } else {
      res = await verifyLoginOtp({ email, otp: otpCode });
    }

    if (!res.success) {
      setError(res.message || 'OTP verification failed. Please try again.');
      setIsVerifying(false);
      return;
    }

    // Success! Show confirmation then redirect
    setSuccessMessage(
      purpose === 'registration'
        ? 'Account successfully verified! Redirecting to login...'
        : 'Sign in successful! Redirecting...'
    );

    setTimeout(() => {
      if (purpose === 'registration') {
        navigate('/login', {
          replace: true,
          state: {
            successMessage: 'Account verified successfully! Please log in to continue.',
            email,
          },
        });
      } else {
        navigate(redirectTarget, { replace: true });
      }
    }, 1200);
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending || !email) return;

    setIsResending(true);
    setError(null);

    const res = await resendOtp(email, purpose);

    if (!res.success) {
      setError(res.message || 'Failed to resend code. Please try again shortly.');
      setIsResending(false);
      return;
    }

    setCooldown(60);
    setIsResending(false);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-3.5 border border-primary/20 shadow-soft-sm">
          <KeyRound className="w-3.5 h-3.5 text-primary" />
          <span>SECURITY VERIFICATION</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight mb-2">
          Verify Your <span className="gradient-text">Code</span>
        </h1>

        <p className="text-sm text-text-secondary font-sans leading-relaxed">
          {purpose === 'registration'
            ? 'Your account has been created! Verification is optional, but you can enter the code sent to:'
            : 'We sent a 6-digit verification code to:'}
          <br />
          <strong className="text-text-main font-semibold">{email || 'your email'}</strong>
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-soft-md">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
            <span className="font-sans leading-relaxed">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
            <span className="font-sans leading-relaxed font-semibold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* 6 Digit Inputs */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 text-center font-heading">
              Enter 6-Digit OTP
            </label>
            <div className="flex justify-between gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying || Boolean(successMessage)}
                  className="w-12 h-14 sm:w-13 sm:h-15 text-center text-xl font-bold font-heading rounded-xl border border-border bg-white text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all selection:bg-transparent"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isVerifying}
            disabled={Boolean(successMessage)}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Confirm & Continue
          </Button>
        </form>

        {/* Optional Skip Option for Registration */}
        {purpose === 'registration' && (
          <div className="mt-4 pt-4 border-t border-border/70 text-center">
            <Link
              to="/login"
              state={{
                successMessage: 'Registration successful! Please log in to continue.',
                email,
              }}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-primary/20 bg-background-lavender text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all font-heading shadow-soft-xs"
            >
              <span>Skip for now & Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <p className="text-[11px] text-text-secondary mt-1.5 font-sans">
              Your profile is ready. You can log in and verify your email anytime.
            </p>
          </div>
        )}

        {/* Resend Action */}
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs font-sans">
          <span className="text-text-secondary">Didn't receive the email?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
              cooldown > 0
                ? 'text-text-secondary/50 cursor-not-allowed'
                : 'text-primary hover:text-primary-deep'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to={purpose === 'registration' ? '/register' : '/login'}
            className="text-[11px] text-text-secondary hover:text-primary font-sans transition-colors"
          >
            ← Back to {purpose === 'registration' ? 'registration' : 'sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
};
