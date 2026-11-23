import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ClipboardList,
  MonitorPlay,
  Bell,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGetUserNotifications, getAssetUrl } from '../services/api';

export const UserLayout: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Load unread notification counter
  useEffect(() => {
    let isMounted = true;
    async function checkNotifications() {
      try {
        const res = await apiGetUserNotifications();
        if (isMounted && res.success && res.data) {
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        // Silently handle
      }
    }
    checkNotifications();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'My Profile', path: '/dashboard/profile', icon: User, exact: false },
    { name: 'My Requests', path: '/dashboard/requests', icon: ClipboardList, exact: false },
    {
      name: 'My Demos',
      path: '/dashboard/demos',
      icon: MonitorPlay,
      exact: false,
    },
    {
      name: 'Messages & Updates',
      path: '/dashboard/notifications',
      icon: Bell,
      exact: false,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: 'Account Settings', path: '/dashboard/settings', icon: Settings, exact: false },
  ];

  const isNavActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-background-alt/40 min-h-[calc(100vh-140px)] py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Horizontal Sub-Navigation Tab Bar */}
        <div className="md:hidden mb-6 bg-white rounded-2xl p-2 border border-border shadow-soft-xs overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-primary text-white shadow-soft-xs font-bold'
                    : 'text-text-secondary hover:text-text-main hover:bg-background-alt'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{item.name}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      active ? 'bg-white text-primary' : 'bg-primary text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop Container Grid: Left Navigation Sidebar + Right Content Outlet */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Desktop Left Sidebar Card */}
          <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white rounded-3xl border border-border shadow-soft-xs p-5 sticky top-[92px] flex-shrink-0">
            {/* User Profile Summary Card */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-border">
              {user?.profileImage ? (
                <img
                  src={getAssetUrl(user.profileImage)}
                  alt={user.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-primary/30 shadow-soft-xs flex-shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-base flex items-center justify-center shadow-soft-xs font-heading flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="overflow-hidden min-w-0">
                <div className="text-sm font-bold text-text-main truncate font-heading">
                  {user?.name}
                </div>
                <div className="text-[11px] text-text-secondary truncate font-sans">
                  {user?.email}
                </div>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-background-lavender text-primary text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Client Workspace</span>
                </div>
              </div>
            </div>

            {/* Profile Completion Indicator */}
            {user?.profileCompletion !== undefined && user.profileCompletion < 100 && (
              <Link
                to="/dashboard/profile"
                className="mb-5 p-3 rounded-2xl bg-background-lavender/60 hover:bg-background-lavender border border-primary/20 transition-all block group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-text-main mb-1.5">
                  <span className="text-[11px] text-primary group-hover:underline">Complete Profile</span>
                  <span className="text-primary font-heading font-black">{user.profileCompletion}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${user.profileCompletion}%` }}
                  />
                </div>
              </Link>
            )}

            {/* Navigation Menu */}
            <nav className="space-y-1 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 mb-2 font-heading">
                Workspace Menu
              </div>

              {navItems.map((item) => {
                const active = isNavActive(item.path, item.exact);
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs lg:text-sm font-medium transition-all ${
                      active
                        ? 'bg-background-lavender text-primary font-bold shadow-soft-xs border border-primary/20'
                        : 'text-text-secondary hover:text-text-main hover:bg-background-alt border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : 'text-text-secondary'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary text-white flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Actions & Admin link if applicable */}
            <div className="pt-4 border-t border-border space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 mb-2 font-heading">
                Quick Links
              </div>
              <Link
                to="/contact"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
              >
                <span>Submit New Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-primary hover:bg-background-lavender transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-2 text-left"
              >
                <span>Sign Out</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 min-w-0 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
