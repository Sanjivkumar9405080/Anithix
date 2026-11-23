import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ClipboardList,
  MonitorPlay,
  Clock,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  apiGetUserProfile,
  apiGetUserRequests,
  apiGetUserDemos,
  AdminContactMessage,
  DemoItem,
  UserDashboardStats,
} from '../../services/api';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserDashboardStats>({
    totalRequests: 0,
    inProgressRequests: 0,
    totalDemos: 0,
    unreadNotifications: 0,
  });
  const [recentRequests, setRecentRequests] = useState<AdminContactMessage[]>([]);
  const [recentDemos, setRecentDemos] = useState<DemoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, requestsRes, demosRes] = await Promise.all([
        apiGetUserProfile(),
        apiGetUserRequests(),
        apiGetUserDemos(),
      ]);

      if (profileRes.success && profileRes.data) {
        setStats(profileRes.data.stats);
      }
      if (requestsRes.success && requestsRes.data) {
        setRecentRequests(requestsRes.data.requests.slice(0, 3));
      }
      if (demosRes.success && demosRes.data) {
        setRecentDemos(demosRes.data.demos.slice(0, 2));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const profilePct = user?.profileCompletion ?? 30;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>New</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>In Review</span>
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Replied</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span>Resolved</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background-alt text-text-secondary">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* 1. Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-white via-background-lavender/30 to-white rounded-3xl border border-border p-6 sm:p-8 shadow-soft-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-primary/20 shadow-soft-sm flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-2xl sm:text-3xl flex items-center justify-center font-heading shadow-soft-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-lavender text-primary text-xs font-bold uppercase tracking-wider mb-2 font-heading border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Client Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                {user?.company ? `${user.company} • ` : ''}
                Track your active requests, test shared interactive prototypes, and collaborate with ANTHIX engineers.
              </p>
            </div>
          </div>

          {/* Profile completion gauge */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border shadow-soft-xs min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold font-heading mb-2">
              <span className="text-text-main">Profile Completion</span>
              <span className="text-primary">{profilePct}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-background-alt overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-sky-400 transition-all duration-500"
                style={{ width: `${profilePct}%` }}
              />
            </div>

            <Link
              to="/dashboard/profile"
              className="inline-flex items-center justify-between w-full text-xs font-bold text-primary hover:text-primary-deep transition-colors"
            >
              <span>{profilePct < 100 ? 'Complete your details' : 'Edit profile'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Live Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Requests */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-soft-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="text-2xl sm:text-3xl font-black font-heading text-text-main mt-1">
              {stats.totalRequests}
            </div>
            <Link
              to="/dashboard/requests"
              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-2"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Requests in Progress */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-soft-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Under Review
            </span>
            <div className="text-2xl sm:text-3xl font-black font-heading text-amber-600 mt-1">
              {stats.inProgressRequests}
            </div>
            <span className="text-[11px] text-text-secondary block mt-2">Active engineering review</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Shared Demos */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-soft-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Shared Demos
            </span>
            <div className="text-2xl sm:text-3xl font-black font-heading text-primary mt-1">
              {stats.totalDemos}
            </div>
            <Link
              to="/dashboard/demos"
              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-2"
            >
              <span>Launch prototypes</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <MonitorPlay className="w-6 h-6" />
          </div>
        </div>

        {/* Unread Updates */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-soft-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              New Updates
            </span>
            <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-600 mt-1">
              {stats.unreadNotifications}
            </div>
            <Link
              to="/dashboard/notifications"
              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-2"
            >
              <span>Read notifications</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Two-Column Workspace: Shared Demos & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Shared Interactive Demos */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-soft-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <MonitorPlay className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-heading text-text-main">
                    Shared Project Demos
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Prototypes tailored specifically for your organization
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/demos"
                className="text-xs font-bold text-primary hover:text-primary-deep transition-colors"
              >
                View all ({stats.totalDemos})
              </Link>
            </div>

            <div className="pt-5 space-y-4">
              {loading ? (
                <div className="py-12 text-center text-text-secondary text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                  <span>Loading shared demos...</span>
                </div>
              ) : recentDemos.length === 0 ? (
                <div className="p-8 rounded-2xl bg-background-alt text-center border border-border/80">
                  <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-3">
                    <MonitorPlay className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold font-heading text-sm text-text-main">
                    No Demos Shared Yet
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                    When our engineers configure an interactive prototype for your project, it will appear right here with full access.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-xs hover:bg-primary-hover transition-colors"
                  >
                    <span>Request a Custom Prototype</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                recentDemos.map((demo) => (
                  <div
                    key={demo._id}
                    className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-all bg-background-alt/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-background-lavender text-primary uppercase">
                          {demo.category}
                        </span>
                        {demo.isExpired && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                            Expired
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-text-main truncate">
                        {demo.title}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                        {demo.description}
                      </p>
                      <div className="text-[10px] text-text-secondary mt-1.5">
                        Shared {new Date(demo.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      {demo.isExpired ? (
                        <span className="text-xs text-rose-500 font-medium italic">Link Expired</span>
                      ) : (
                        <a
                          href={demo.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-xs hover:bg-primary-hover transition-colors whitespace-nowrap"
                        >
                          <span>Launch Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Inquiries & Requests */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-soft-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-background-lavender text-primary flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-heading text-text-main">
                    Recent Requests
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Your submitted proposals and project inquiries
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/requests"
                className="text-xs font-bold text-primary hover:text-primary-deep transition-colors"
              >
                View all ({stats.totalRequests})
              </Link>
            </div>

            <div className="pt-5 space-y-4">
              {loading ? (
                <div className="py-12 text-center text-text-secondary text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                  <span>Loading inquiries...</span>
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="p-8 rounded-2xl bg-background-alt text-center border border-border/80">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold font-heading text-sm text-text-main">
                    No Inquiries Submitted
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                    Have an idea for a website, CRM, enterprise software, or AI workflow? Submit an inquiry and our team will get back to you promptly.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-xs hover:bg-primary-hover transition-colors"
                  >
                    <span>Submit Your First Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                recentRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-all bg-background-alt/30 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-xs text-text-main truncate">
                          {req.service}
                        </span>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                        {req.message}
                      </p>
                      <div className="text-[10px] text-text-secondary mt-1.5">
                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Link
                      to={`/dashboard/requests`}
                      className="p-2 rounded-xl border border-border hover:border-primary hover:text-primary text-text-secondary transition-colors"
                      title="Inspect Request"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-secondary">Ready to start another build?</span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>New Request Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
