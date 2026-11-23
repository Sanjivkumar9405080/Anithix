import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center animate-pulse mb-4 border border-primary/20 shadow-soft-sm">
          <Sparkles className="w-7 h-7 text-primary animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <p className="text-sm font-medium text-text-secondary tracking-wide font-sans">
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the intended destination and pass user-friendly message
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname + location.search,
          message: 'Please register or log in to contact ANTHIX.',
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};
