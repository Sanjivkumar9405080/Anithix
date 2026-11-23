import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  MonitorPlay,
  MessageSquare,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban, exact: false },
    { name: 'Client Requests', path: '/admin/requests', icon: ClipboardList, exact: false },
    { name: 'Clients / Users', path: '/admin/users', icon: Users, exact: false },
    { name: 'Client Demos', path: '/admin/demos', icon: MonitorPlay, exact: false },
    { name: 'Messages & Inquiries', path: '/admin/messages', icon: MessageSquare, exact: false },
    { name: 'Email Clients', path: '/admin/email', icon: Mail, exact: false },
    { name: 'Settings', path: '/admin/settings', icon: Settings, exact: false },
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
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-sm flex items-center justify-center font-heading">
            A
          </div>
          <div>
            <span className="font-heading font-black text-sm tracking-tight text-text-main">ANTHIX</span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-background-lavender text-primary uppercase">Admin</span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-text-main hover:bg-background-alt border border-border"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-[#8B7CFF] to-sky-400 text-white font-black text-base flex items-center justify-center shadow-soft-sm font-heading">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg tracking-tight text-text-main">
                ANTHIX
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary tracking-wider uppercase">
                <ShieldCheck className="w-3 h-3 text-primary" />
                <span>Admin Console</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 mb-2 font-heading">
              Management
            </div>

            {navItems.map((item) => {
              const active = isNavActive(item.path, item.exact);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-background-lavender/70 text-primary font-bold shadow-soft-xs'
                      : 'text-text-secondary hover:text-text-main hover:bg-background-alt'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-text-secondary'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* External links */}
          <div className="mt-8 pt-4 border-t border-border space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 mb-2 font-heading">
              Website
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
            >
              <span>Test Contact Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Administrator profile bottom bar */}
        <div className="p-4 border-t border-border bg-background-alt/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-text-main truncate font-heading">{user?.name}</div>
                <div className="text-[10px] text-text-secondary truncate">{user?.email}</div>
              </div>
            </div>

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
            <span>Admin</span>
            <span>/</span>
            <span className="text-text-main capitalize font-semibold">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background-lavender/60 border border-primary/20 text-xs font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Live Session</span>
            </div>
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
