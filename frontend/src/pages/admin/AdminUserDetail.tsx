import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  History,
  MonitorPlay,
  Plus,
  Briefcase,
  MapPin,
  Globe,
} from 'lucide-react';
import {
  apiGetAdminUserById,
  SafeUser,
  AdminContactMessage,
  EmailActivityItem,
  DemoItem,
  getAssetUrl,
} from '../../services/api';
import { Button } from '../../components/common/Button';
import { EmailComposerModal } from '../../components/admin/EmailComposerModal';

export const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<SafeUser | null>(null);
  const [inquiries, setInquiries] = useState<AdminContactMessage[]>([]);
  const [emailActivities, setEmailActivities] = useState<EmailActivityItem[]>([]);
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Email Composer Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const fetchUserDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    const res = await apiGetAdminUserById(id);
    if (!res.success || !res.data) {
      setError(res.message || 'Failed to fetch user dossier.');
      setIsLoading(false);
      return;
    }

    setUser(res.data.user);
    setInquiries(res.data.inquiries || []);
    if ((res.data as any).emailActivities) {
      setEmailActivities((res.data as any).emailActivities);
    }
    if ((res.data as any).demos) {
      setDemos((res.data as any).demos);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            In Progress
          </span>
        );
      case 'replied':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Replied
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-alt text-text-secondary">
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

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center font-sans">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-heading text-text-main">Client Not Found</h2>
        <p className="text-xs text-text-secondary mt-1 mb-6">
          The requested client record does not exist or may have been deleted.
        </p>
        <Link to="/admin/users">
          <Button variant="outline" size="sm">
            Back to Users Directory
          </Button>
        </Link>
      </div>
    );
  }

  const phone = user.phone || inquiries.find((i) => Boolean(i.phone))?.phone;
  const company = user.company || inquiries.find((i) => Boolean(i.organization))?.organization;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Back button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="p-2 rounded-xl border border-border bg-white hover:bg-background-alt text-text-secondary hover:text-text-main transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl text-text-main tracking-tight">
                {user.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-primary text-white font-heading'
                    : 'bg-background-lavender text-primary'
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/admin/demos?prefillUser=${user.id}&userName=${encodeURIComponent(
              user.name
            )}&userEmail=${encodeURIComponent(user.email)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary hover:bg-background-lavender text-xs font-bold transition-all shadow-soft-xs"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Share Demo</span>
          </Link>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-soft-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Client Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-4">
            <div className="flex items-center gap-3.5 pb-4 border-b border-border">
              {user.profileImage ? (
                <img
                  src={getAssetUrl(user.profileImage)}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-primary/30 shadow-soft-sm flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-xl flex items-center justify-center font-heading shadow-soft-sm flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-heading font-extrabold text-base text-text-main truncate">
                  {user.name}
                </h3>
                <div className="text-xs text-text-secondary truncate mt-0.5">{user.email}</div>
                <div className="mt-1">
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Email
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Unverified Email
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-text-secondary">Company / Organization</span>
                <div className="font-semibold text-text-main flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-text-secondary" />
                  <span>{company || 'Not specified'}</span>
                </div>
              </div>

              {user.jobTitle && (
                <div className="space-y-1">
                  <span className="text-text-secondary">Job Title</span>
                  <div className="font-semibold text-text-main flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-text-secondary" />
                    <span>{user.jobTitle}</span>
                  </div>
                </div>
              )}

              {user.organizationType && (
                <div className="space-y-1">
                  <span className="text-text-secondary">Organization Type</span>
                  <div className="font-semibold text-text-main">
                    {user.organizationType}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-text-secondary">Phone Number</span>
                <div className="font-semibold text-text-main flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-secondary" />
                  <span>{phone || 'Not specified'}</span>
                </div>
              </div>

              {user.location && (
                <div className="space-y-1">
                  <span className="text-text-secondary">City / Location</span>
                  <div className="font-semibold text-text-main flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-text-secondary" />
                    <span>{user.location}</span>
                  </div>
                </div>
              )}

              {user.website && (
                <div className="space-y-1">
                  <span className="text-text-secondary">Website</span>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline flex items-center gap-1.5 truncate"
                  >
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{user.website}</span>
                  </a>
                </div>
              )}

              {user.bio && (
                <div className="space-y-1 pt-2 border-t border-border">
                  <span className="text-text-secondary">Bio / Project Context</span>
                  <p className="text-text-main italic text-xs leading-relaxed bg-background-alt p-3 rounded-xl border border-border">
                    "{user.bio}"
                  </p>
                </div>
              )}

              {user.interests && user.interests.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-text-secondary block">Areas of Interest</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-background-lavender text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-2 border-t border-border">
                <span className="text-text-secondary">Member Since</span>
                <div className="font-semibold text-text-main flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-center">
                <div className="p-2.5 bg-background-alt rounded-xl">
                  <span className="text-[10px] text-text-secondary block">Inquiries</span>
                  <span className="text-base font-extrabold text-primary font-heading">
                    {inquiries.length}
                  </span>
                </div>
                <div className="p-2.5 bg-background-alt rounded-xl">
                  <span className="text-[10px] text-text-secondary block">Demos Shared</span>
                  <span className="text-base font-extrabold text-sky-600 font-heading">
                    {demos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2/3): Demos, Requests History & Communication Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shared Demos Section */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-base text-text-main">
                  Demos Shared with {user.name} ({demos.length})
                </h3>
              </div>

              <Link
                to={`/admin/demos?prefillUser=${user.id}&userName=${encodeURIComponent(
                  user.name
                )}&userEmail=${encodeURIComponent(user.email)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Share New Demo</span>
              </Link>
            </div>

            {demos.length === 0 ? (
              <div className="p-6 rounded-2xl bg-background-alt text-center border border-border text-xs text-text-secondary">
                No custom project demos have been shared with this client yet.
              </div>
            ) : (
              <div className="space-y-3">
                {demos.map((demo) => (
                  <div
                    key={demo._id}
                    className="p-4 rounded-2xl border border-border bg-white hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-text-main truncate">
                          {demo.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-background-lavender text-primary font-bold">
                          {demo.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            demo.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {demo.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1">{demo.description}</p>
                      <div className="text-[10px] text-text-secondary mt-1">
                        Shared {new Date(demo.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={demo.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-text-main hover:text-primary transition-colors inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inquiries Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-base text-text-main">
                  All Requests by {user.name} ({inquiries.length})
                </h3>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-background-alt text-center border border-border text-xs text-text-secondary">
                This client has not submitted any project requests yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className="p-5 rounded-2xl border border-border bg-white hover:border-primary/40 transition-all shadow-soft-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading font-bold text-sm text-text-main">
                            {inq.subject || 'Project Inquiry'}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-background-lavender text-primary font-bold">
                            {inq.service}
                          </span>
                          {getStatusBadge(inq.status)}
                        </div>
                        <div className="text-[11px] text-text-secondary mt-1 flex items-center gap-2">
                          <span>
                            ID: <code className="font-mono">{inq._id}</code>
                          </span>
                          <span>•</span>
                          <span>{new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <Link
                        to={`/admin/requests/${inq._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:border-primary text-text-main hover:text-primary text-xs font-bold transition-all bg-white shadow-soft-xs flex-shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-alt/60 text-xs text-text-main whitespace-pre-wrap leading-relaxed font-sans">
                      {inq.message}
                    </div>

                    {inq.adminNotes && (
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
                        <span className="font-bold">Internal Note:</span> {inq.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Communication Log */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-soft-xs space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-base text-text-main">
                Client Communication Logs ({emailActivities.length})
              </h3>
            </div>

            {emailActivities.length === 0 ? (
              <div className="p-6 rounded-2xl bg-background-alt text-center border border-border text-xs text-text-secondary">
                No emails dispatched to this client yet.
              </div>
            ) : (
              <div className="space-y-3">
                {emailActivities.map((act) => (
                  <div
                    key={act._id}
                    className="p-4 rounded-2xl border border-border bg-background-alt/30 space-y-2 text-xs"
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
                      <span>Recipient: {act.recipient}</span>
                      <span>{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialRecipient={user.email}
        initialRecipientName={user.name}
        initialSubject="Regarding Your ANTHIX Inquiry"
        userId={user.id}
        onSuccess={() => {
          fetchUserDetail();
        }}
      />
    </div>
  );
};
