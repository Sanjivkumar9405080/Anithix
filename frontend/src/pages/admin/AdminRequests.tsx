import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Download,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  Building,
  Phone,
  Calendar,
} from 'lucide-react';
import {
  apiGetAdminMessages,
  AdminContactMessage,
  PaginationData,
  getExportMessagesCsvUrl,
} from '../../services/api';
import { EmailComposerModal } from '../../components/admin/EmailComposerModal';

export const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<AdminContactMessage[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [service, setService] = useState('all');
  const [sort, setSort] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Email Composer Modal State
  const [emailModalProps, setEmailModalProps] = useState<{
    isOpen: boolean;
    recipient: string;
    recipientName: string;
    subject: string;
    requestId: string;
  }>({
    isOpen: false,
    recipient: '',
    recipientName: '',
    subject: '',
    requestId: '',
  });

  const fetchRequests = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    const res = await apiGetAdminMessages({
      page,
      limit: 15,
      search: search.trim(),
      status,
      service,
      sort,
    });

    if (!res.success || !res.data) {
      setError(res.message || 'Failed to fetch client requests.');
      setIsLoading(false);
      return;
    }

    setRequests(res.data.messages);
    setPagination(res.data.pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests(1);
  }, [status, service, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests(1);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            In Progress
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Replied
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background-alt text-text-secondary border border-border">
            {st}
          </span>
        );
    }
  };

  const handleOpenEmail = (req: AdminContactMessage) => {
    setEmailModalProps({
      isOpen: true,
      recipient: req.email,
      recipientName: req.name,
      subject: `Re: Your ANTHIX Inquiry - ${req.service || req.subject}`,
      requestId: req._id,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight">
            Client Requests
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse, filter, inspect, and reply to all project submissions received across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={getExportMessagesCsvUrl({ search, status, service })}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-xs font-bold text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary" />
            <span>Export Filtered CSV</span>
          </a>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-border shadow-soft-sm flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by client name, email, company, or request ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-background-alt border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Unread)</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>

          {/* Service Filter */}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-3 py-2 bg-background-alt border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Services</option>
            <option value="Digital Solutions">Digital Solutions</option>
            <option value="AI & Automation">AI & Automation</option>
            <option value="Technical Training">Technical Training</option>
            <option value="Website or Application Development">Web & App Development</option>
            <option value="Custom Project">Custom Project</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-background-alt border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 3. Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. Requests Table */}
      <div className="bg-white rounded-2xl border border-border shadow-soft-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm text-text-secondary font-medium">Loading client requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text-main mb-1">
              No client requests found
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              {search || status !== 'all' || service !== 'all'
                ? 'No requests match your current search and filter settings.'
                : 'No client inquiries have been submitted through the contact page yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main">
              <thead className="bg-background-alt/70 text-text-secondary text-xs font-heading font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-5">Request ID</th>
                  <th className="py-3.5 px-5">Client</th>
                  <th className="py-3.5 px-5">Contact Info</th>
                  <th className="py-3.5 px-5">Service</th>
                  <th className="py-3.5 px-5">Message Preview</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Received</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-background-alt/40 transition-colors">
                    {/* Request ID */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-primary bg-background-lavender/60 px-2 py-0.5 rounded border border-primary/10">
                        #{req._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* Client Name & Company */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-text-main">{req.name}</div>
                      {req.organization ? (
                        <div className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-text-secondary" />
                          <span className="truncate max-w-[140px]">{req.organization}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-text-secondary/70">Individual Client</div>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-5">
                      <div className="text-xs text-text-main font-medium">{req.email}</div>
                      {req.phone && (
                        <div className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-text-secondary" />
                          <span>{req.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Service */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background-alt text-text-main border border-border">
                        {req.service}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="py-4 px-5 max-w-xs">
                      <div className="text-xs font-semibold text-text-main truncate">
                        {req.subject || 'Project Inquiry'}
                      </div>
                      <div className="text-xs text-text-secondary truncate mt-0.5">
                        {req.message}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 whitespace-nowrap">{getStatusBadge(req.status)}</td>

                    {/* Received Date */}
                    <td className="py-4 px-5 whitespace-nowrap text-xs text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-text-secondary" />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary/70">
                        {new Date(req.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEmail(req)}
                          className="p-2 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors bg-white shadow-soft-xs"
                          title="Reply by Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          to={`/admin/requests/${req._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:border-primary text-text-main hover:text-primary text-xs font-bold transition-all bg-white shadow-soft-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination */}
        {!isLoading && requests.length > 0 && (
          <div className="px-6 py-4 bg-background-alt/50 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing <span className="font-bold text-text-main">{requests.length}</span> of{' '}
              <span className="font-bold text-text-main">{pagination.total}</span> requests
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchRequests(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-border bg-white text-text-main hover:bg-background-alt disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-text-main px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchRequests(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-border bg-white text-text-main hover:bg-background-alt disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Email Composer Modal */}
      <EmailComposerModal
        isOpen={emailModalProps.isOpen}
        onClose={() => setEmailModalProps({ ...emailModalProps, isOpen: false })}
        initialRecipient={emailModalProps.recipient}
        initialRecipientName={emailModalProps.recipientName}
        initialSubject={emailModalProps.subject}
        requestId={emailModalProps.requestId}
        onSuccess={() => {
          fetchRequests(pagination.page);
        }}
      />
    </div>
  );
};
