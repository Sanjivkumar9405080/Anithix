import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  LogOut,
  LogIn,
  LayoutDashboard,
  User as UserIcon,
  ClipboardList,
  MonitorPlay,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useAuth } from '../../context/AuthContext';
import { getAssetUrl } from '../../services/api';
import { Button } from './Button';

export const Navbar = () => {
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Our Approach', path: '/approach' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  // All standard navigation links remain visible exactly as they were before and after login
  const visibleNavLinks = navLinks;

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    setMobileMenuOpen(false);

    // Handle hash links like /#approach
    if (path.includes('#')) {
      const hash = path.substring(path.indexOf('#'));
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.includes('#')) {
      const hash = path.substring(path.indexOf('#'));
      return location.pathname === '/' && location.hash === hash;
    }
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E8EAF2] shadow-soft-sm py-3'
            : 'bg-white border-b border-[#E8EAF2]/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* ANTHIX Brand Wordmark */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="ANTHIX Homepage"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-[#8B7CFF] to-sky-400 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-black text-base font-heading tracking-wider">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-text-main group-hover:text-primary transition-colors">
                ANTHIX
              </span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-text-secondary -mt-1 hidden sm:block">
                Ideas Into Impact
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {visibleNavLinks.map((link) => {
              const active = isLinkActive(link.path);

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleLinkClick(link.path, e)}
                  className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 relative ${
                    active
                      ? 'text-primary font-bold bg-background-lavender/80 shadow-soft-xs'
                      : 'text-text-secondary hover:text-text-main hover:bg-background-alt'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Action Buttons & Profile State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* 1. Dashboard Navigation Option - Shown alongside Profile after login */}
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 ${
                      isActive || location.pathname.startsWith('/dashboard')
                        ? 'text-primary font-bold bg-background-lavender/90 border border-primary/20 shadow-soft-xs'
                        : 'text-text-secondary hover:text-text-main hover:bg-background-alt border border-transparent'
                    }`
                  }
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                  <span>Dashboard</span>
                </NavLink>

                {/* 2. Profile Icon / Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-background-alt border border-border transition-all shadow-soft-xs hover:border-primary/40 focus:outline-none"
                    aria-expanded={userDropdownOpen}
                    aria-label="User profile menu"
                  >
                    {user.profileImage ? (
                      <img
                        src={getAssetUrl(user.profileImage)}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-primary/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-sky-400 text-white font-bold text-xs flex items-center justify-center shadow-soft-xs font-heading">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="text-xs font-semibold text-text-main max-w-[100px] truncate font-sans hidden sm:inline">
                      {user.name.split(' ')[0]}
                    </span>

                    <ChevronDown
                      className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                {/* Desktop User Avatar Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-border shadow-soft-xl py-2 z-50 animate-fade-in font-sans">
                    {/* User summary header */}
                    <div className="px-4 py-3 border-b border-border bg-background-alt/50">
                      <div className="font-heading font-bold text-sm text-text-main truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-text-secondary truncate mt-0.5">{user.email}</div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'admin'
                              ? 'bg-primary text-white font-heading'
                              : 'bg-background-lavender text-primary'
                          }`}
                        >
                          {user.role === 'admin' ? 'Administrator' : 'Client Account'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Menu Items */}
                    <div className="p-1.5 space-y-0.5 text-xs font-medium">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-main hover:bg-background-lavender/60 hover:text-primary transition-colors font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        <span>Client Dashboard</span>
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-main hover:bg-background-lavender/60 hover:text-primary transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-text-secondary" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/dashboard/requests"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-main hover:bg-background-lavender/60 hover:text-primary transition-colors"
                      >
                        <ClipboardList className="w-4 h-4 text-text-secondary" />
                        <span>My Requests</span>
                      </Link>

                      <Link
                        to="/dashboard/demos"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-main hover:bg-background-lavender/60 hover:text-primary transition-colors"
                      >
                        <MonitorPlay className="w-4 h-4 text-text-secondary" />
                        <span>My Demos</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-primary font-bold bg-background-lavender/50 hover:bg-background-lavender transition-colors mt-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    {/* Sign out item */}
                    <div className="pt-1.5 mt-1 border-t border-border px-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors px-3.5 py-2 rounded-xl hover:bg-background-alt font-heading"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center text-xs font-bold text-primary bg-background-lavender hover:bg-background-lavender/80 transition-colors px-3.5 py-2 rounded-xl border border-primary/20 font-heading"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}

            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hidden sm:inline-flex">
              <Button
                size="sm"
                icon={<ArrowUpRight className="w-4 h-4 ml-0.5" />}
              >
                <Sparkles className="w-3.5 h-3.5 opacity-90 mr-1.5 inline-block" />
                <span>Let's Talk</span>
              </Button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-text-main hover:bg-background-alt border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-text-main/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-[62px] left-4 right-4 z-40 p-5 bg-white rounded-3xl border border-border shadow-soft-xl transition-all duration-300 transform md:hidden max-h-[85vh] overflow-y-auto ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2 font-sans">
          {/* User Account Row on Mobile */}
          {isAuthenticated && user ? (
            <div className="p-4 mb-2 rounded-2xl bg-background-lavender/40 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.profileImage ? (
                    <img
                      src={getAssetUrl(user.profileImage)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-primary/40 shadow-soft-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center font-heading">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-text-main font-heading">{user.name}</div>
                    <div className="text-[11px] text-text-secondary truncate max-w-[170px]">{user.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Quick Client Links */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-primary/10">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-border text-xs font-semibold text-text-main hover:text-primary"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-border text-xs font-semibold text-text-main hover:text-primary"
                >
                  <UserIcon className="w-3.5 h-3.5 text-text-secondary" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/dashboard/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-border text-xs font-semibold text-text-main hover:text-primary"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-text-secondary" />
                  <span>Requests</span>
                </Link>

                <Link
                  to="/dashboard/demos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-border text-xs font-semibold text-text-main hover:text-primary"
                >
                  <MonitorPlay className="w-3.5 h-3.5 text-text-secondary" />
                  <span>My Demos</span>
                </Link>
              </div>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider font-heading hover:bg-primary-hover shadow-soft-xs"
                >
                  Open Admin Console
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-2 pb-2 border-b border-border">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-3 rounded-xl border border-border text-xs font-bold text-text-main hover:bg-background-alt font-heading"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-deep font-heading shadow-soft-xs"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Standard Navigation Links */}
          {visibleNavLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(e) => handleLinkClick(link.path, e)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'text-primary bg-background-lavender/60 font-bold'
                    : 'text-text-main hover:bg-background-alt'
                }`}
              >
                <span>{link.name}</span>
                {active && <div className="w-2 h-2 rounded-full bg-primary" />}
              </NavLink>
            );
          })}

          <div className="pt-3 mt-2 border-t border-border">
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button
                className="w-full"
                icon={<ArrowUpRight className="w-4 h-4 ml-1" />}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                <span>Let's Talk</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
