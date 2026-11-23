import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Mail,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  apiGetAdminSettings,
  AdminSystemSettings,
  apiSendClientEmail,
} from '../../services/api';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Test Email state
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailSuccess, setTestEmailSuccess] = useState<string | null>(null);
  const [testEmailError, setTestEmailError] = useState<string | null>(null);

  const fetchSettings = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiGetAdminSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin settings', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSendTestEmail = async () => {
    if (!user?.email) return;
    setTestEmailLoading(true);
    setTestEmailSuccess(null);
    setTestEmailError(null);

    try {
      const res = await apiSendClientEmail({
        to: user.email,
        recipientName: user.name || 'Admin',
        subject: '🧪 ANTHIX System Test Email',
        body: `Hello ${user.name || 'Admin'},\n\nThis is a verification test email dispatched from your ANTHIX Admin Console.\n\nAll email delivery systems and SMTP relays are functioning as expected.\n\nServer timestamp: ${new Date().toISOString()}`,
      });

      if (res.success) {
        setTestEmailSuccess(`Test email dispatched successfully to ${user.email}! Check inbox or terminal.`);
      } else {
        setTestEmailError(res.message || 'Failed to dispatch test email.');
      }
    } catch (err: any) {
      setTestEmailError(err.message || 'Network error sending test email.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
            System &amp; Admin Settings
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Monitor API health, database connections, mail transport status, and administrative security.
          </p>
        </div>

        <button
          onClick={() => fetchSettings(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-text-main font-semibold text-xs hover:bg-background-alt transition-colors shadow-soft-xs"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          <span>Refresh Health</span>
        </button>
      </div>

      {/* 2. Admin User Information Card */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-soft-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-text-main">
              Authenticated Admin Account
            </h2>
            <p className="text-xs text-text-secondary">
              Logged in administrator identity and privileges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Full Name
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block font-heading">
              {user?.name || 'Administrator'}
            </span>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Email Address
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block">
              {user?.email || 'N/A'}
            </span>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Security Role
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-primary text-white uppercase tracking-wider font-heading">
                {user?.role || 'admin'}
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. System & Database Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Status */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-soft-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm font-heading text-text-main">
                  MongoDB Cluster Health
                </h3>
                <span className="text-[11px] text-text-secondary">Primary database connection</span>
              </div>
            </div>

            {settings?.database.connected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Disconnected</span>
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
              <span className="text-text-secondary">Connection State:</span>
              <span className="font-semibold text-text-main uppercase font-mono">
                {settings?.database.state || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
              <span className="text-text-secondary">Mongoose ReadyState:</span>
              <span className="font-semibold text-text-main font-mono">
                {settings?.database.readyState ?? 1} (1 = Ready)
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-text-secondary">Database Target:</span>
              <span className="font-semibold text-text-main font-mono text-[11px]">Anithix</span>
            </div>
          </div>
        </div>

        {/* Server & Runtime Environment */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-soft-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm font-heading text-text-main">
                  Backend Runtime
                </h3>
                <span className="text-[11px] text-text-secondary">Node.js &amp; Express API</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-background-lavender text-primary border border-primary/20">
              <Clock className="w-3 h-3" />
              <span>
                {settings ? formatUptime(settings.system.serverUptimeSeconds) : 'Calculating...'}
              </span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
              <span className="text-text-secondary">Environment:</span>
              <span className="font-semibold text-text-main capitalize">
                {settings?.system.environment || 'development'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
              <span className="text-text-secondary">Node Engine:</span>
              <span className="font-semibold text-text-main font-mono">
                {settings?.system.nodeVersion || process.version || 'v20+'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/60">
              <span className="text-text-secondary">Internal Port:</span>
              <span className="font-semibold text-text-main font-mono">
                {settings?.system.apiPort || 5000}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-text-secondary">Allowed Client CORS:</span>
              <span className="font-semibold text-text-main font-mono text-[11px] truncate max-w-[200px]">
                {settings?.system.clientOrigin || 'http://localhost:5173'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Email / SMTP Configuration & Test Card */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-soft-xs space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-text-main">
                Email Dispatch Configuration
              </h2>
              <p className="text-xs text-text-secondary">
                SMTP delivery transport settings for sending OTPs and client replies
              </p>
            </div>
          </div>

          {settings?.emailProvider.isConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>SMTP Ready</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span>Dev Console Mock</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Transport Mode
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block">
              {settings?.emailProvider.mode || 'Local Mock Logger'}
            </span>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              SMTP Host
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block font-mono">
              {settings?.emailProvider.host || 'smtp.gmail.com'}
            </span>
          </div>

          <div className="p-4 bg-background-alt rounded-2xl border border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading block">
              Default Sender Address
            </span>
            <span className="text-sm font-bold text-text-main mt-1 block font-mono">
              {settings?.emailProvider.sender || 'anthix.verify@gmail.com'}
            </span>
          </div>
        </div>

        {/* Live Test Email Section */}
        <div className="p-5 bg-background-lavender/40 rounded-2xl border border-primary/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-heading text-text-main">
                Test Outgoing Email Service
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Send a real test email to <span className="font-semibold text-primary">{user?.email}</span> to verify relay credentials.
              </p>
            </div>

            <button
              onClick={handleSendTestEmail}
              disabled={testEmailLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft-xs transition-all hover:shadow-soft-sm disabled:opacity-50 whitespace-nowrap"
            >
              <Send className={`w-3.5 h-3.5 ${testEmailLoading ? 'animate-spin' : ''}`} />
              <span>{testEmailLoading ? 'Sending Test...' : 'Send Test Email'}</span>
            </button>
          </div>

          {testEmailSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{testEmailSuccess}</span>
            </div>
          )}

          {testEmailError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{testEmailError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
