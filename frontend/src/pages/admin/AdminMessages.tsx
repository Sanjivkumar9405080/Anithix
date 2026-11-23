import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  StickyNote,
} from 'lucide-react';
import {
  apiGetAdminMessages,
  AdminContactMessage,
  PaginationData,
  getExportMessagesCsvUrl,
} from '../../services/api';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [service, setService] = useState('all');
  const [sort, setSort] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    const res = await apiGetAdminMessages({
      page,
      limit: 10,
      search: search.trim(),
      status,
      service,
      sort,
    });

    if (!res.success || !res.data) {
      setError(res.message || 'Failed to fetch contact inquiries.');
      setIsLoading(false);
      return;
    }

    setMessages(res.data.messages);
    setPagination(res.data.pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages(1);
  }, [status, service, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessages(1);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
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
            {st}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight">
            Contact Inquiries
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage, review, and track client inquiries submitted across the ANTHIX platform.
          </p>
        </div>

        <div>
          <a
            href={getExportMessagesCsvUrl({ search, status, service })}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Filtered CSV</span>
          </a>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-border shadow-soft-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, details..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-text-secondary font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-white text-xs text-text-main font-medium focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-white text-xs text-text-main font-medium focus:outline-none focus:border-primary"
          >
            <option value="all">All Services</option>
            <option value="Digital Solutions">Digital Solutions</option>
            <option value="AI & Automation">AI & Automation</option>
            <option value="Technical Training">Technical Training</option>
            <option value="Other / Not Sure Yet">Other / Custom</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-white text-xs text-text-main font-medium focus:outline-none focus:border-primary"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Messages Table Card */}
      <div className="bg-white rounded-3xl border border-border shadow-soft-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-background-alt rounded-xl animate-pulse" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare className="w-10 h-10 text-text-secondary/40 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-base text-text-main">No Inquiries Found</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
              No contact inquiries match the current search filters or date range.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-background-alt/50 border-b border-border text-text-secondary uppercase text-[10px] font-heading font-bold">
                  <th className="py-3.5 px-4 font-bold">Client / Name</th>
                  <th className="py-3.5 px-4 font-bold">Service</th>
                  <th className="py-3.5 px-4 font-bold">Organization / Phone</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Notes</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-background-alt/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-text-main font-heading text-xs">{msg.name}</div>
                      <div className="text-[11px] text-text-secondary truncate max-w-[200px]">{msg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text-main whitespace-nowrap">
                      {msg.service}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      <div className="font-medium text-text-main truncate max-w-[150px]">
                        {msg.organization || '—'}
                      </div>
                      <div className="text-[11px] text-text-secondary">{msg.phone || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(msg.status)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {msg.adminNotes ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold">
                          <StickyNote className="w-3.5 h-3.5" />
                          <span>Has notes</span>
                        </span>
                      ) : (
                        <span className="text-text-secondary/40 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/messages/${msg._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-main hover:bg-background-alt hover:border-primary/40 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing page <strong className="text-text-main">{pagination.page}</strong> of{' '}
              <strong className="text-text-main">{pagination.totalPages}</strong> ({pagination.total} total inquiries)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fetchMessages(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-1.5 rounded-lg border border-border bg-white hover:bg-background-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchMessages(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="p-1.5 rounded-lg border border-border bg-white hover:bg-background-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
