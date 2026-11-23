import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Review your client credentials, verification status, and security preferences.
        </p>
      </div>

      {/* 2. Security & Account Overview Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-soft-xs space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-text-main">
              Account Credentials
            </h2>
            <p className="text-xs text-text-secondary">
              Verified identity and authentication details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Registered Email
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-text-main font-mono">
                {user?.email}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Account Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                {user?.accountStatus || 'active'}
              </span>
              <span className="text-text-secondary text-[11px]">In Good Standing</span>
            </div>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Registration Date
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Access Role
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block capitalize">
              {user?.role === 'admin' ? 'Administrator' : 'Standard Client'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Privacy & Security Assurance */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-soft-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm font-heading text-text-main">
              Data Isolation &amp; Privacy
            </h3>
            <p className="text-xs text-text-secondary">
              How your inquiries, prototypes, and profile data are protected
            </p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Your client portal workspace is isolated strictly to your MongoDB user ID. Inquiries submitted through the website, prototype builds, and private files shared with you are authenticated server-side and are never accessible to other platform users.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            to="/dashboard/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-background-alt text-xs font-bold text-text-main transition-colors shadow-soft-xs"
          >
            <UserIcon className="w-4 h-4 text-primary" />
            <span>Edit Profile Info</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Current Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
