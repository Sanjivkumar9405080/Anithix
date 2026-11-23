import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  StickyNote,
  Send,
  User,
  History,
  ExternalLink,
} from 'lucide-react';
import {
  apiGetAdminMessageById,
  apiUpdateMessageStatus,
  apiUpdateMessageNotes,
  apiDeleteMessage,
  AdminContactMessage,
  EmailActivityItem,
} from '../../services/api';
import { Button } from '../../components/common/Button';
import { EmailComposerModal } from '../../components/admin/EmailComposerModal';

export const AdminMessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [message, setMessage] = useState<AdminContactMessage | null>(null);
  const [emailActivities, setEmailActivities] = useState<EmailActivityItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmArchive, setConfirmArchive] = useState(false);

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const fetchMessage = async () => {
    if (!id) return;
    setIsLoading(true);
    setFeedback(null);

    const res = await apiGetAdminMessageById(id);
    if (!res.success || !res.data) {
      setFeedback({ type: 'error', text: res.message || 'Failed to load request details.' });
      setIsLoading(false);
      return;
    }

    setMessage(res.data.message);
    setNotes(res.data.message.adminNotes || '');
    if ((res.data as any).emailActivities) {
      setEmailActivities((res.data as any).emailActivities);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const handleStatusChange = async (newStatus: 'new' | 'in_progress' | 'replied' | 'closed') => {
    if (!id || !message || message.status === newStatus) return;

    setIsUpdatingStatus(true);
    setFeedback(null);

    const res = await apiUpdateMessageStatus(id, newStatus);
    setIsUpdatingStatus(false);

    if (!res.success || !res.data) {
      setFeedback({ type: 'error', text: res.message || 'Failed to update status.' });
      return;
    }

    setMessage(res.data.message);
    setFeedback({
      type: 'success',
      text: `Request status changed to "${newStatus.replace('_', ' ')}".`,
    });
  };

  const handleSaveNotes = async () => {
    if (!id) return;
    setIsSavingNotes(true);
    setFeedback(null);

    const res = await apiUpdateMessageNotes(id, notes);
    setIsSavingNotes(false);

    if (!res.success || !res.data) {
      setFeedback({ type: 'error', text: res.message || 'Failed to save admin notes.' });
      return;
    }

    setMessage(res.data.message);
    setFeedback({ type: 'success', text: 'Internal administrator notes saved securely.' });
  };

  const handleArchive = async () => {
    if (!id) return;
    setIsArchiving(true);

    const res = await apiDeleteMessage(id);
    setIsArchiving(false);

    if (!res.success) {
      setFeedback({ type: 'error', text: res.message || 'Failed to archive request.' });
      return;
    }

    navigate('/admin/requests', { replace: true });
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'new':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            In Progress
          </span>
        );
      case 'replied':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Replied
          </span>
        );
      case 'closed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-background-alt text-text-secondary">
            {st}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4 font-sans">
        <div className="h-8 w-40 bg-background-alt rounded-lg animate-pulse" />
        <div className="h-64 bg-white rounded-3xl border border-border animate-pulse" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="max-w-md mx-auto py-16 text-center font-sans">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-heading text-text-main">Request Not Found</h2>
        <p className="text-xs text-text-secondary mt-1 mb-6">
          This client submission may have been archived or the ID is invalid.
        </p>
        <Link to="/admin/requests">
          <Button variant="outline" size="sm">
            Back to Client Requests
          </Button>
        </Link>
      </div>
    );
  }

  const linkedUserId =
    typeof message.userId === 'object' && message.userId !== null
      ? (message.userId as any)._id
      : typeof message.userId === 'string'
      ? message.userId
      : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Back button and Top Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/requests"
            className="p-2 rounded-xl border border-border bg-white hover:bg-background-alt text-text-secondary hover:text-text-main transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl text-text-main tracking-tight">
                {message.subject || 'Project Inquiry'}
              </h1>
              {getStatusBadge(message.status)}
            </div>
            <div className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
              <span>
                ID: <code className="text-text-main font-mono text-[11px]">{message._id}</code>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Reply by Email & Status Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-soft-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Reply by Email</span>
          </button>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-border">
            {(['new', 'in_progress', 'replied', 'closed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                disabled={isUpdatingStatus || message.status === st}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  message.status === st
                    ? 'bg-background-lavender text-primary font-bold'
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main 2-column detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Client Profile & Untruncated Message */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-text-secondary">
                Client Contact Information
              </h2>

              {linkedUserId && (
                <Link
                  to={`/admin/users/${linkedUserId}`}
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Open Client Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-text-secondary">Full Name</span>
                <div className="text-sm font-bold text-text-main font-heading">{message.name}</div>
              </div>

              <div className="space-y-1">
                <span className="text-text-secondary">Email Address</span>
                <div className="text-sm font-semibold text-text-main flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <a href={`mailto:${message.email}`} className="hover:underline text-primary">
                    {message.email}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-text-secondary">Company or Organization</span>
                <div className="text-sm font-semibold text-text-main flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-text-secondary" />
                  <span>{message.organization || 'Not provided'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-text-secondary">Phone Number</span>
                <div className="text-sm font-semibold text-text-main flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-secondary" />
                  <span>{message.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-border">
                <span className="text-text-secondary">Service of Interest</span>
                <div className="text-sm font-bold text-primary font-heading">{message.service}</div>
              </div>
            </div>
          </div>

          {/* Full Untruncated Message Box */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-3">
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-text-secondary">
              Submitted Request Message
            </h2>

            <div className="p-4 rounded-2xl bg-background-alt border border-border text-sm text-text-main leading-relaxed whitespace-pre-wrap font-sans">
              {message.message}
            </div>

            <div className="text-[11px] text-text-secondary flex items-center gap-1.5 pt-1">
              <Clock className="w-3 h-3" />
              <span>Received: {new Date(message.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Communication & Email History */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-sm text-text-main">
                  Email Communication History ({emailActivities.length})
                </h3>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Send Another Email</span>
              </button>
            </div>

            {emailActivities.length === 0 ? (
              <div className="p-4 rounded-2xl bg-background-alt/50 border border-border text-center text-xs text-text-secondary">
                No outgoing emails sent yet for this request. Click "Reply by Email" above to start
                communication.
              </div>
            ) : (
              <div className="space-y-3">
                {emailActivities.map((act) => (
                  <div
                    key={act._id}
                    className="p-3.5 rounded-2xl border border-border bg-background-alt/30 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-main">{act.subject}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          act.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {act.status}
                      </span>
                    </div>
                    <p className="text-text-secondary whitespace-pre-wrap line-clamp-3">
                      {act.body}
                    </p>
                    <div className="text-[10px] text-text-secondary pt-1 flex items-center justify-between">
                      <span>To: {act.recipient}</span>
                      <span>{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Internal Notes & Danger Zone */}
        <div className="space-y-6">
          {/* Internal Notes Box */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <StickyNote className="w-4 h-4 text-primary" />
              <h2 className="font-heading font-bold text-sm text-text-main">
                Private Internal Notes
              </h2>
            </div>

            <p className="text-[11px] text-text-secondary leading-normal">
              Internal notes are strictly restricted to administrators and are never sent to clients.
            </p>

            <textarea
              rows={7}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add call notes, estimated scope, follow-up deadlines, assigned developers..."
              className="w-full p-3.5 rounded-xl border border-border bg-white text-xs text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y font-sans"
            />

            <Button
              size="sm"
              onClick={handleSaveNotes}
              isLoading={isSavingNotes}
              icon={<Save className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Save Internal Notes
            </Button>
          </div>

          {/* Quick Reply Card */}
          <div className="bg-background-lavender/40 rounded-3xl p-5 border border-primary/20 space-y-2">
            <h3 className="font-heading font-bold text-xs text-primary uppercase tracking-wider">
              Need to contact {message.name}?
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Dispatch an official communication directly to <strong>{message.email}</strong>.
            </p>
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-soft-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Reply</span>
            </button>
          </div>

          {/* Archive / Delete Danger Zone */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-3">
            <h3 className="font-heading font-bold text-xs text-rose-600 uppercase tracking-wider">
              Danger Zone
            </h3>

            {confirmArchive ? (
              <div className="space-y-2 p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <p className="text-xs text-rose-800 font-medium">
                  Archive this request? It will be removed from the active requests queue.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleArchive}
                    isLoading={isArchiving}
                    className="bg-rose-600 hover:bg-rose-700 text-white flex-1 text-xs"
                  >
                    Yes, Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmArchive(false)}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmArchive(true)}
                icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
              >
                Archive Request
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialRecipient={message.email}
        initialRecipientName={message.name}
        initialSubject={`Re: Your ANTHIX Inquiry - ${message.service}`}
        requestId={message._id}
        userId={linkedUserId || undefined}
        onSuccess={() => {
          fetchMessage();
        }}
      />
    </div>
  );
};
