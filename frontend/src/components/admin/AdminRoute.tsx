import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-alt flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center animate-pulse mb-4 border border-primary/20 shadow-soft-sm">
          <Sparkles className="w-7 h-7 text-primary animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <p className="text-sm font-medium text-text-secondary">
          Verifying administrator authorization...
        </p>
      </div>
    );
  }

  // Not logged in -> redirect to admin login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{
          from: location.pathname + location.search,
          message: 'Please authenticate with administrator credentials.',
        }}
        replace
      />
    );
  }

  // Logged in as normal user (role !== 'admin') -> Show strict access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background-alt flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-border shadow-soft-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-wider">
            403 Forbidden
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-text-main mt-4 mb-2">
            Administrator Access Required
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            You are signed in as <strong className="text-text-main">{user?.email}</strong> with standard user privileges. This section is strictly restricted to authorized administrators.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/" className="w-full">
              <Button variant="primary" className="w-full" icon={<ArrowLeft className="w-4 h-4 mr-1" />}>
                Return to Website
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
