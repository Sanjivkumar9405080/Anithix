import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Calendar,
  ArrowRight,
  RefreshCw,
  X,
} from 'lucide-react';
import { apiGetUserRequests, AdminContactMessage } from '../../services/api';

export const DashboardRequests: React.FC = () => {
  const [requests, setRequests] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<AdminContactMessage | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiGetUserRequests();
      if (res.success && res.data) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Failed to load user requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.subject && r.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span>New Submission</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Under Review</span>
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Team Replied</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span>Completed / Closed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background-alt text-text-secondary">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
              My Inquiries &amp; Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-background-lavender text-primary">
              {requests.length} Total
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Track status updates and review your project consultations with ANTHIX engineers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-white text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>

          <Link
            to="/contact"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft-sm transition-all hover:shadow-soft-md"
          >
            <span>Submit New Request</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-soft-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search your requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary transition-all font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">Status:</span>
          <div className="flex rounded-xl border border-border p-1 bg-background-alt">
            {[
              { label: 'All', value: 'all' },
              { label: 'New', value: 'new' },
              { label: 'Reviewing', value: 'in_progress' },
              { label: 'Replied', value: 'replied' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab.value
                    ? 'bg-white text-primary shadow-soft-xs'
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Requests Table / Cards */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-soft-xs">
        {loading ? (
          <div className="py-16 text-center text-text-secondary">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm font-medium">Fetching your requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-base text-text-main">
              {searchTerm || statusFilter !== 'all' ? 'No matching requests found' : 'No requests submitted yet'}
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-md mx-auto leading-relaxed">
              {searchTerm || statusFilter !== 'all'
                ? 'Try clearing your search or status filter to see all submissions.'
                : 'Whenever you submit an inquiry through our Contact page, its review status, timeline, and responses will appear here.'}
            </p>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-sm hover:bg-primary-hover transition-colors"
              >
                <span>Submit Your First Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                onClick={() => setSelectedRequest(req)}
                className="p-5 sm:p-6 hover:bg-background-alt/40 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-text-secondary">
                      #{req._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="font-heading font-black text-sm sm:text-base text-text-main group-hover:text-primary transition-colors">
                      {req.service}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>

                  {req.subject && (
                    <div className="text-xs font-medium text-text-main truncate">
                      {req.subject}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
                    {req.message}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-text-secondary pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Submitted on {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 flex-shrink-0">
                  <span className="text-[11px] font-bold text-primary group-hover:underline inline-flex items-center gap-1 font-heading">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/30 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">
                    REF #{selectedRequest._id.slice(-6).toUpperCase()}
                  </span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <h3 className="text-lg font-black font-heading text-text-main mt-1">
                  {selectedRequest.service}
                </h3>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-xl border border-border hover:bg-background-alt text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div className="p-4 bg-background-alt rounded-2xl border border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-secondary block text-[11px]">Submitted By:</span>
                  <span className="font-semibold text-text-main">{selectedRequest.name}</span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Submission Date:</span>
                  <span className="font-semibold text-text-main">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedRequest.organization && (
                  <div>
                    <span className="text-text-secondary block text-[11px]">Organization:</span>
                    <span className="font-semibold text-text-main">{selectedRequest.organization}</span>
                  </div>
                )}
                {selectedRequest.phone && (
                  <div>
                    <span className="text-text-secondary block text-[11px]">Phone:</span>
                    <span className="font-semibold text-text-main">{selectedRequest.phone}</span>
                  </div>
                )}
              </div>

              {selectedRequest.subject && (
                <div>
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1 font-heading">
                    Subject
                  </span>
                  <div className="p-3 bg-background-alt/60 rounded-xl border border-border text-text-main font-medium">
                    {selectedRequest.subject}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 font-heading">
                  Original Submitted Message
                </span>
                <div className="p-4 bg-background-alt/60 rounded-2xl border border-border text-text-main whitespace-pre-wrap leading-relaxed">
                  {selectedRequest.message}
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-4 rounded-2xl bg-background-lavender/40 border border-primary/20 space-y-1">
                <span className="font-bold text-xs font-heading text-text-main block">
                  Current Engineering Status:
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedRequest.status === 'new' &&
                    'Your inquiry has been received and queued for initial technical triage.'}
                  {selectedRequest.status === 'in_progress' &&
                    'Our architecture team is currently analyzing technical feasibility and scoping prototype milestones.'}
                  {selectedRequest.status === 'replied' &&
                    'A representative has followed up regarding this inquiry. Check your email or notifications for updates.'}
                  {selectedRequest.status === 'closed' &&
                    'This consultation has concluded or has transitioned to active development.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-background-alt/40 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-xs hover:bg-primary-hover transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
