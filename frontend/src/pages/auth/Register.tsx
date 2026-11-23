import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || (location.state as any)?.from || '/dashboard';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must include at least one uppercase letter.';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must include at least one lowercase letter.';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must include at least one number.';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setGeneralError(null);

    const cleanEmail = formData.email.trim().toLowerCase();

    const res = await register({
      name: formData.name.trim(),
      email: cleanEmail,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!res.success) {
      if (res.errors && res.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        res.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
      setGeneralError(res.message || 'Registration failed. Please review your details.');
      setIsSubmitting(false);
      return;
    }

    // Navigate to OTP verification screen
    navigate(
      `/verify-otp?email=${encodeURIComponent(cleanEmail)}&purpose=registration&redirect=${encodeURIComponent(
        redirectTarget
      )}`
    );
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-3.5 border border-primary/20 shadow-soft-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>JOIN ANTHIX</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight mb-2">
          Create Your <span className="gradient-text">Account</span>
        </h1>

        <p className="text-sm text-text-secondary font-sans leading-relaxed">
          Sign up with your email to contact our engineering team and explore custom solutions.
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-soft-md">
        {generalError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
            <span className="font-sans leading-relaxed">{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Full Name <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Alex Mercer"
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans ${
                  errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-sans">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Email Address <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="e.g. alex@company.com"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans ${
                  errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1 font-sans">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Password <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans ${
                  errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                }`}
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
            {errors.password && <p className="text-xs text-rose-500 mt-1 font-sans">{errors.password}</p>}
            <p className="text-[11px] text-text-secondary mt-1 font-sans">
              Must include 8+ chars, uppercase, lowercase, and a number.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="reg-confirm" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Confirm Password <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans ${
                  errors.confirmPassword ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors p-1"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1 font-sans">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-4"
          >
            Create Account & Send Code
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-secondary font-sans">
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
