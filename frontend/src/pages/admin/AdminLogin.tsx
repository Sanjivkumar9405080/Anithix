import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const customMessage = (location.state as any)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await adminLogin(cleanEmail, password);

    if (!res.success) {
      setError(res.message || 'Invalid administrator credentials.');
      setIsSubmitting(false);
      return;
    }

    if (res.data?.user?.role !== 'admin') {
      setError('Access denied. Your account does not possess administrator privileges.');
      setIsSubmitting(false);
      return;
    }

    const redirectTarget = (location.state as any)?.from || '/admin';
    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-alt flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to ANTHIX Website</span>
          </Link>
        </div>

        {/* Brand Card */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-soft-sm font-heading">
            A
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-lavender text-primary text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Administrator Portal</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-text-main tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Authorized personnel only. Sessions are audited and strictly monitored.
          </p>
        </div>

        {customMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-background-lavender/80 border border-primary/20 text-text-main text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{customMessage}</span>
          </div>
        )}

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-soft-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Admin Email <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="admin@anthix.com"
                  autoComplete="email"
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Password <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
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
              className="w-full mt-4"
            >
              Sign In to Admin Console
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center text-[11px] text-text-secondary font-sans">
            Need administrator credentials? Provision via the server CLI: <br />
            <code className="bg-background-alt px-1.5 py-0.5 rounded text-primary font-mono text-[10px]">
              npm run admin:create
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
