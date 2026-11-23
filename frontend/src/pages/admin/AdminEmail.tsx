import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  apiGetEmailActivities,
  EmailActivityItem,
  PaginationData,
} from '../../services/api';
import { EmailComposerModal } from '../../components/admin/EmailComposerModal';
import { Link } from 'react-router-dom';

export const AdminEmail: React.FC = () => {
  const [activities, setActivities] = useState<EmailActivityItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed'>('all');
  
  // Modals
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [viewEmailModal, setViewEmailModal] = useState<EmailActivityItem | null>(null);

  const fetchActivities = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiGetEmailActivities(page, 20);
      if (res.success && res.data) {
        setActivities(res.data.activities);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load email activities', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  // Client-side filtering for search & status filter
  const filteredActivities = activities.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.recipientName && item.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalSent = activities.filter((a) => a.status === 'sent').length;
  const totalFailed = activities.filter((a) => a.status === 'failed').length;
  const uniqueRecipients = new Set(activities.map((a) => a.recipient)).size;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
              Email Communications
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-background-lavender text-primary">
              {pagination.total} Logged
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Track outgoing client notifications, inquiries responses, and send custom emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchActivities(pagination.page)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-white text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>

          <button
            onClick={() => setComposeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft-sm transition-all hover:shadow-soft-md"
          >
            <Send className="w-4 h-4" />
            <span>Compose Email</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-soft-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-text-secondary font-medium">Successfully Sent</div>
            <div className="text-xl font-black font-heading text-text-main mt-0.5">{totalSent}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-soft-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-text-secondary font-medium">Unique Clients Reached</div>
            <div className="text-xl font-black font-heading text-text-main mt-0.5">{uniqueRecipients}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-soft-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-text-secondary font-medium">Delivery Failures</div>
            <div className="text-xl font-black font-heading text-text-main mt-0.5">{totalFailed}</div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-soft-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by recipient or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">Filter:</span>
          <div className="flex rounded-xl border border-border p-1 bg-background-alt">
            {(['all', 'sent', 'failed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-white text-primary shadow-soft-xs'
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Email Activity Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-alt/60 text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading">
                <th className="py-3.5 px-4 sm:px-6">Recipient</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sent By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-secondary">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <span>Loading email logs...</span>
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-secondary">
                    <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="font-heading font-bold text-text-main text-base">No email logs found</div>
                    <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try clearing your filters or search term to see logged emails.'
                        : 'No client emails have been dispatched yet. Click "Compose Email" above to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const sentByName =
                    typeof act.sentBy === 'object' && act.sentBy !== null
                      ? act.sentBy.name
                      : 'Admin';

                  return (
                    <tr
                      key={act._id}
                      className="hover:bg-background-alt/40 transition-colors group"
                    >
                      {/* Recipient */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-text-main">
                          {act.recipientName || 'Client'}
                        </div>
                        <div className="text-xs text-text-secondary">{act.recipient}</div>
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-text-main truncate" title={act.subject}>
                          {act.subject}
                        </div>
                        <div className="text-[11px] text-text-secondary line-clamp-1 mt-0.5">
                          {act.body.replace(/<[^>]*>?/gm, '')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {act.status === 'sent' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Sent</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>

                      {/* Sent By */}
                      <td className="py-4 px-4 text-xs text-text-secondary">
                        <span className="font-medium text-text-main">{sentByName}</span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-text-secondary whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-text-secondary/70" />
                          <span>{new Date(act.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-[10px] text-text-secondary/70 pl-5">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewEmailModal(act)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-background-lavender transition-colors"
                            title="View Email Content"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {act.requestId && (
                            <Link
                              to={`/admin/requests/${act.requestId}`}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-background-lavender transition-colors"
                              title="Go to Associated Request"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing page <span className="font-bold text-text-main">{pagination.page}</span> of{' '}
              <span className="font-bold text-text-main">{pagination.totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchActivities(pagination.page - 1)}
                className="px-3 py-1.5 rounded-lg border border-border text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background-alt"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchActivities(pagination.page + 1)}
                className="px-3 py-1.5 rounded-lg border border-border text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background-alt"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. View Email Modal */}
      {viewEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-heading">
                  Email Dispatch Record
                </span>
                <h3 className="text-lg font-black font-heading text-text-main mt-0.5">
                  {viewEmailModal.subject}
                </h3>
              </div>
              <button
                onClick={() => setViewEmailModal(null)}
                className="p-1.5 rounded-xl border border-border hover:bg-background-alt text-text-secondary"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-background-alt rounded-2xl border border-border text-xs">
                <div>
                  <span className="text-text-secondary block text-[11px]">Recipient:</span>
                  <span className="font-semibold text-text-main">
                    {viewEmailModal.recipientName ? `${viewEmailModal.recipientName} ` : ''}
                    &lt;{viewEmailModal.recipient}&gt;
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Status:</span>
                  <span
                    className={`font-semibold capitalize ${
                      viewEmailModal.status === 'sent' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {viewEmailModal.status}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Date & Time:</span>
                  <span className="font-semibold text-text-main">
                    {new Date(viewEmailModal.createdAt).toLocaleString()}
                  </span>
                </div>
                {viewEmailModal.messageId && (
                  <div>
                    <span className="text-text-secondary block text-[11px]">Message ID:</span>
                    <span className="font-mono text-[10px] text-text-secondary truncate block">
                      {viewEmailModal.messageId}
                    </span>
                  </div>
                )}
              </div>

              {viewEmailModal.error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  <span className="font-bold">Failure reason: </span>
                  {viewEmailModal.error}
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2 font-heading">
                  Message Body
                </span>
                <div className="p-4 bg-background-alt/60 rounded-2xl border border-border text-text-main whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                  {viewEmailModal.body}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-background-alt/30 flex justify-end">
              <button
                onClick={() => setViewEmailModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-xs hover:bg-primary-hover transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Compose Email Modal */}
      <EmailComposerModal
        isOpen={composeModalOpen}
        onClose={() => setComposeModalOpen(false)}
        onSuccess={() => {
          fetchActivities(1);
        }}
      />
    </div>
  );
};
