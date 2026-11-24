import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect target from query parameter or router state
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || (location.state as any)?.from || '/dashboard';
  const customMessage = (location.state as any)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please provide your registered email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please provide a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUnverifiedEmail(null);

    const res = await login(cleanEmail, password);

    if (!res.success) {
      const msg = res.message || 'Invalid email or password.';
      setError(msg);
      setIsSubmitting(false);

      // Check if account is not yet email-verified
      if (
        msg.toLowerCase().includes('not verified') ||
        res.errors?.some((err) => err.message.toLowerCase().includes('not verified'))
      ) {
        setUnverifiedEmail(cleanEmail);
      }
      return;
    }

    // Success! Show confirmation and navigate to target
    setLoginSuccess(true);
    setIsSubmitting(false);

    // If account has administrator privileges and was targeting generic dashboard or root, route to the Admin Dashboard.
    // If the admin was navigating specifically to a page like /contact, respect that destination.
    const userRole = res.data?.user?.role;
    const finalDestination =
      userRole === 'admin' && (redirectTarget === '/dashboard' || redirectTarget === '/')
        ? '/admin'
        : redirectTarget;

    setTimeout(() => {
      navigate(finalDestination, { replace: true });
    }, 600);
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-md mx-auto font-sans">
      {/* Friendly Context Notification if redirected from protected route (e.g. /contact) */}
      {customMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-background-lavender border border-primary/20 text-text-main text-xs sm:text-sm flex items-start gap-3 shadow-soft-xs">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{customMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary text-xs font-bold tracking-wider uppercase mb-3.5 border border-primary/20 shadow-soft-sm font-heading">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>SECURE ACCOUNT ACCESS</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight mb-2">
          Sign In to <span className="gradient-text">ANTHIX</span>
        </h1>

        <p className="text-sm text-text-secondary font-sans leading-relaxed">
          Enter your registered email and password to access your account.
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-soft-md">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <span className="font-sans leading-relaxed">{error}</span>
            </div>

            {/* If email is unverified, offer direct verification link */}
            {unverifiedEmail && (
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-600 font-medium">
                  Have an unverified code?
                </span>
                <Link
                  to={`/verify-otp?email=${encodeURIComponent(
                    unverifiedEmail
                  )}&purpose=registration&redirect=${encodeURIComponent(redirectTarget)}`}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-soft-xs inline-flex items-center gap-1"
                >
                  Verify Email Now
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Success confirmation */}
        {loginSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span className="font-sans font-semibold">
              Authenticated successfully! Redirecting...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2 font-heading"
            >
              Email Address <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="sarah@example.com"
                autoComplete="email"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-text-main uppercase tracking-wider font-heading"
              >
                Password <span className="text-primary">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
          <p className="text-xs text-text-secondary font-sans">
            Don't have an ANTHIX account?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectTarget)}`}
              className="text-primary font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>

          <p className="text-[11px] text-text-secondary/80 font-sans">
            Need administrative access?{' '}
            <Link
              to="/admin/login"
              className="text-text-main font-semibold hover:text-primary transition-colors underline"
            >
              Admin Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
