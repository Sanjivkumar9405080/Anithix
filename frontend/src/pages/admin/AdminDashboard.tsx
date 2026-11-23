import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
  FolderKanban,
  Plus,
  ArrowRight,
  Download,
  AlertCircle,
  Eye,
  PieChart,
  Layers,
} from 'lucide-react';
import {
  apiGetAdminDashboard,
  AdminDashboardData,
  getExportMessagesCsvUrl,
} from '../../services/api';
import { Button } from '../../components/common/Button';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);

    const res = await apiGetAdminDashboard();
    if (!res.success || !res.data) {
      setError(res.message || 'Failed to load dashboard metrics.');
      setIsLoading(false);
      return;
    }

    setData(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    totalMessages: 0,
    newMessages: 0,
    inProgressMessages: 0,
    repliedMessages: 0,
    closedMessages: 0,
    totalUsers: 0,
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            In Progress
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Replied
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-alt text-text-secondary border border-border">
            {status}
          </span>
        );
    }
  };

  const metricCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtitle: `${stats.publishedProjects} Published`,
      icon: FolderKanban,
      color: 'text-primary',
      bg: 'bg-background-lavender/70',
      border: 'border-primary/20',
      link: '/admin/projects',
    },
    {
      title: 'Active Projects',
      value: stats.publishedProjects,
      subtitle: `${stats.draftProjects} Drafts`,
      icon: Layers,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      link: '/admin/projects?status=published',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: 'Registered Accounts',
      icon: Users,
      color: 'text-[#635BFF]',
      bg: 'bg-[#F0EDFF]',
      border: 'border-[#635BFF]/20',
      link: '/admin/users',
    },
    {
      title: 'Client Requests',
      value: stats.totalMessages,
      subtitle: `${stats.newMessages} New / Unread`,
      icon: MessageSquare,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      link: '/admin/requests',
    },
    {
      title: 'New Requests',
      value: stats.newMessages,
      subtitle: 'Require Attention',
      icon: Sparkles,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      link: '/admin/requests?status=new',
    },
    {
      title: 'In Progress',
      value: stats.inProgressMessages,
      subtitle: 'Active Engagements',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      link: '/admin/requests?status=in_progress',
    },
    {
      title: 'Completed / Closed',
      value: stats.closedMessages + stats.repliedMessages,
      subtitle: `${stats.repliedMessages} Replied`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      link: '/admin/requests?status=replied',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Real-time management for ANTHIX projects, client requests, and registered users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/requests?status=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50/70 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors shadow-soft-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>View New Requests ({stats.newMessages})</span>
          </Link>

          <Link
            to="/admin/projects?new=1"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-soft-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>

          <a
            href={getExportMessagesCsvUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-white text-xs font-semibold text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 sm:gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`bg-white rounded-2xl p-4 border ${card.border} shadow-soft-xs flex flex-col justify-between hover:shadow-soft-md hover:border-primary/40 transition-all group`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading truncate">
                  {card.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-text-main group-hover:text-primary transition-colors">
                  {isLoading ? (
                    <span className="inline-block w-8 h-6 bg-background-alt animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </div>
                <div className="text-[10px] text-text-secondary font-medium mt-0.5">
                  {card.subtitle}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Service Distribution Graph + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Demand Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-border shadow-soft-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-background-lavender text-primary flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text-main">
                  Service Inquiries Demand
                </h3>
                <p className="text-xs text-text-secondary">
                  Distribution of client requests by technological domain
                </p>
              </div>
            </div>
            <Link
              to="/admin/requests"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>All Requests</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-xs text-text-secondary">Loading statistics...</span>
            </div>
          ) : !data?.serviceDistribution || data.serviceDistribution.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-secondary">
              No inquiry distribution data available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {data.serviceDistribution.map((item, idx) => {
                const total = stats.totalMessages || 1;
                const percentage = Math.round((item.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-main">{item.service}</span>
                      <span className="text-text-secondary font-medium">
                        {item.count} inquiries ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-background-alt rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Summary / Management Links */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-sm flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-text-main mb-1">
              Management Portal
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Direct access to all platform management modules.
            </p>

            <div className="space-y-2.5">
              <Link
                to="/admin/projects"
                className="p-3 rounded-2xl border border-border hover:border-primary/40 bg-background-alt/30 hover:bg-background-lavender/20 transition-all flex items-center justify-between text-xs font-bold text-text-main"
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 text-primary" />
                  <span>Projects Management</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-border text-text-secondary">
                  {stats.totalProjects}
                </span>
              </Link>

              <Link
                to="/admin/requests"
                className="p-3 rounded-2xl border border-border hover:border-primary/40 bg-background-alt/30 hover:bg-background-lavender/20 transition-all flex items-center justify-between text-xs font-bold text-text-main"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span>Client Requests</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-border text-text-secondary">
                  {stats.totalMessages}
                </span>
              </Link>

              <Link
                to="/admin/users"
                className="p-3 rounded-2xl border border-border hover:border-primary/40 bg-background-alt/30 hover:bg-background-lavender/20 transition-all flex items-center justify-between text-xs font-bold text-text-main"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Registered Clients</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-border text-text-secondary">
                  {stats.totalUsers}
                </span>
              </Link>

              <Link
                to="/admin/email"
                className="p-3 rounded-2xl border border-border hover:border-primary/40 bg-background-alt/30 hover:bg-background-lavender/20 transition-all flex items-center justify-between text-xs font-bold text-text-main"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Email Clients</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-border text-primary font-bold">
                  Send
                </span>
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <Link to="/" target="_blank" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-center">
                <span>View Public Website</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Client Requests Table */}
      <div className="bg-white rounded-3xl border border-border shadow-soft-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-text-main">
              Recent Client Requests
            </h3>
            <p className="text-xs text-text-secondary">
              Latest inquiries received through the contact system
            </p>
          </div>
          <Link
            to="/admin/requests"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All ({stats.totalMessages})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
            <p className="text-xs text-text-secondary">Loading inquiries...</p>
          </div>
        ) : !data?.recentMessages || data.recentMessages.length === 0 ? (
          <div className="py-16 text-center text-xs text-text-secondary">
            No client inquiries submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main">
              <thead className="bg-background-alt/60 text-text-secondary text-xs font-heading font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-6">Client</th>
                  <th className="py-3 px-6">Service</th>
                  <th className="py-3 px-6">Message Preview</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Received</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-background-alt/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-text-main">{msg.name}</div>
                      <div className="text-xs text-text-secondary">{msg.email}</div>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background-alt text-text-main border border-border">
                        {msg.service}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 max-w-xs truncate text-xs text-text-secondary">
                      {msg.message}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">{getStatusBadge(msg.status)}</td>
                    <td className="py-3.5 px-6 whitespace-nowrap text-xs text-text-secondary">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap text-right">
                      <Link
                        to={`/admin/requests/${msg._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:border-primary text-text-main hover:text-primary text-xs font-bold transition-all bg-white shadow-soft-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two-Column Grid: Recently Registered Users & Recently Added Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Registered Users */}
        <div className="bg-white rounded-3xl border border-border shadow-soft-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-sm text-text-main">
                Recently Registered Users
              </h3>
            </div>
            <Link
              to="/admin/users"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All Users</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border flex-1">
            {!data?.recentUsers || data.recentUsers.length === 0 ? (
              <div className="py-10 text-center text-xs text-text-secondary">No users found.</div>
            ) : (
              data.recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-background-alt/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-background-lavender text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text-main truncate">{u.name}</div>
                      <div className="text-[11px] text-text-secondary truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-background-alt border border-border text-text-secondary font-medium">
                      {u.inquiriesCount} Requests
                    </span>
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="p-1.5 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors"
                      title="View user dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Added Projects */}
        <div className="bg-white rounded-3xl border border-border shadow-soft-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-sm text-text-main">
                Platform Projects
              </h3>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage Projects</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border flex-1">
            {!data?.recentProjects || data.recentProjects.length === 0 ? (
              <div className="py-10 text-center text-xs text-text-secondary">
                No projects found. Click "Add Project" to create one.
              </div>
            ) : (
              data.recentProjects.map((p) => (
                <div
                  key={p._id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-background-alt/30 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-main truncate">{p.title}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5 truncate">
                      {p.category} • {p.technologies?.slice(0, 3).join(', ')}
                    </div>
                  </div>

                  <Link
                    to="/admin/projects"
                    className="p-1.5 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors flex-shrink-0"
                    title="Manage projects"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
