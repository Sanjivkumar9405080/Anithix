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
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGetUserNotifications, getAssetUrl } from '../services/api';

export const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-background-alt text-text-main flex flex-col md:flex-row font-sans selection:bg-primary/10 selection:text-primary">
      {/* 1. Mobile Top Navigation Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-sm flex items-center justify-center font-heading">
              A
            </div>
            <span className="font-heading font-black text-sm tracking-tight text-text-main">
              ANTHIX
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background-lavender text-primary uppercase">
            Client Portal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/notifications"
            className="p-2 rounded-xl text-text-secondary hover:text-text-main hover:bg-background-alt relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-text-main hover:bg-background-alt border border-border"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-text-main/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 3. Sidebar (Desktop Fixed / Mobile Slide-over) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-border flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center gap-3 pb-6 mb-4 border-b border-border">
            <Link
              to="/"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-[#8B7CFF] to-sky-400 text-white font-black text-base flex items-center justify-center shadow-soft-sm font-heading hover:scale-105 transition-transform"
            >
              A
            </Link>
            <div className="flex flex-col">
              <Link to="/" className="font-heading font-black text-lg tracking-tight text-text-main hover:text-primary transition-colors">
                ANTHIX
              </Link>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Client Workspace</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 mb-2 font-heading">
              Menu
            </div>

            {navItems.map((item) => {
              const active = isNavActive(item.path, item.exact);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-background-lavender/80 text-primary font-bold shadow-soft-xs'
                      : 'text-text-secondary hover:text-text-main hover:bg-background-alt'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-text-secondary'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Website quick links */}
          <div className="mt-8 pt-4 border-t border-border space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 mb-2 font-heading">
              Explore
            </div>
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
            >
              <span>Main Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
            >
              <span>Submit New Request</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-primary hover:bg-background-lavender transition-colors mt-2"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* User profile card at bottom */}
        <div className="p-4 border-t border-border bg-background-alt/50">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2.5 overflow-hidden group"
              title="View Profile"
            >
              {user?.profileImage ? (
                <img
                  src={getAssetUrl(user.profileImage)}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-primary/30 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 font-heading">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-text-main truncate font-heading group-hover:text-primary transition-colors">
                  {user?.name}
                </div>
                <div className="text-[10px] text-text-secondary truncate">{user?.email}</div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 rounded-lg text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 4. Main Body Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <span>Client Workspace</span>
            <span>/</span>
            <span className="text-text-main capitalize font-semibold">
              {location.pathname.replace('/dashboard', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile completion badge */}
            {user?.profileCompletion !== undefined && user.profileCompletion < 100 && (
              <Link
                to="/dashboard/profile"
                className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender/60 border border-primary/20 text-xs font-semibold text-primary hover:bg-background-lavender transition-all"
              >
                <span>Profile: {user.profileCompletion}% Complete</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </Link>
            )}

            {/* Notifications link with unread badge */}
            <Link
              to="/dashboard/notifications"
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
              title="Messages & Updates"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-primary text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-[1px] bg-border" />

            {/* User pill */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 text-xs font-semibold text-text-main hover:text-primary transition-colors"
            >
              {user?.profileImage ? (
                <img
                  src={getAssetUrl(user.profileImage)}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-primary/30"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center font-heading">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span>{user?.name?.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
