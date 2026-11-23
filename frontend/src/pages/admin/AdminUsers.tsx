import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Calendar,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Send,
  Eye,
} from 'lucide-react';
import {
  apiGetAdminUsers,
  apiGetAdminUserById,
  AdminUser,
  PaginationData,
  SafeUser,
  AdminContactMessage,
} from '../../services/api';
import { Link } from 'react-router-dom';
import { EmailComposerModal } from '../../components/admin/EmailComposerModal';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected user for inspection modal
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<{
    user: SafeUser;
    inquiries: AdminContactMessage[];
  } | null>(null);

  // Email modal state
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    recipient: string;
    recipientName: string;
    userId: string;
  }>({
    isOpen: false,
    recipient: '',
    recipientName: '',
    userId: '',
  });

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    const res = await apiGetAdminUsers(page, 10, search.trim());

    if (!res.success || !res.data) {
      setError(res.message || 'Failed to fetch registered users.');
      setIsLoading(false);
      return;
    }

    setUsers(res.data.users);
    setPagination(res.data.pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleOpenUserDetail = async (userId: string) => {
    setSelectedUserId(userId);
    setIsDetailLoading(true);
    setUserDetail(null);

    const res = await apiGetAdminUserById(userId);
    if (res.success && res.data) {
      setUserDetail(res.data);
    }
    setIsDetailLoading(false);
  };

  const handleCloseDetail = () => {
    setSelectedUserId(null);
    setUserDetail(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight">
            Registered Users
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse and manage all registered user accounts and their inquiry histories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-background-lavender text-primary font-bold text-xs flex items-center gap-1.5 border border-primary/20">
            <Users className="w-4 h-4 text-primary" />
            <span>{pagination.total} Total Users</span>
          </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-border shadow-soft-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-text-main placeholder:text-text-secondary"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-soft-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* 3. Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. Users Table */}
      <div className="bg-white rounded-2xl border border-border shadow-soft-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm text-text-secondary font-medium">Loading user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text-main mb-1">
              No users found
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              {search
                ? `No user accounts matched "${search}". Try clearing the search query.`
                : 'No users have registered on the website yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main">
              <thead className="bg-background-alt/70 text-text-secondary text-xs font-heading font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-center">Inquiries</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6">Recent Request</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => {
                  const initials = u.name
                    ? u.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr key={u.id} className="hover:bg-background-alt/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-background-lavender text-primary font-bold text-xs flex items-center justify-center border border-primary/20 flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-text-main">{u.name}</div>
                            <div className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-text-secondary" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                            User
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {u.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Email Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-background-alt text-text-main border border-border">
                          {u.inquiriesCount}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                          <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs text-text-secondary">
                        {u.lastInquiryDate ? (
                          <span>{new Date(u.lastInquiryDate).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-text-secondary/60">None</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenUserDetail(u.id)}
                            className="p-2 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors bg-white shadow-soft-xs"
                            title="Quick View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setEmailModal({
                                isOpen: true,
                                recipient: u.email,
                                recipientName: u.name,
                                userId: u.id,
                              })
                            }
                            className="p-2 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors bg-white shadow-soft-xs"
                            title="Email Client"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/admin/users/${u.id}`}
                            className="px-3 py-1.5 rounded-xl border border-border hover:border-primary text-text-main hover:text-primary text-xs font-bold transition-all bg-white hover:bg-background-lavender/40 shadow-soft-sm inline-flex items-center gap-1"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="px-6 py-4 bg-background-alt/50 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing <span className="font-bold text-text-main">{users.length}</span> of{' '}
              <span className="font-bold text-text-main">{pagination.total}</span> users
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
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
                onClick={() => fetchUsers(pagination.page + 1)}
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

      {/* 6. User Detail Modal / Drawer */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background-alt/40">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg text-text-main">User Profile</h3>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-1.5 rounded-xl text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {isDetailLoading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                  <p className="text-xs text-text-secondary font-medium">Fetching user details...</p>
                </div>
              ) : userDetail ? (
                <>
                  {/* User info card */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-background-lavender/30 border border-primary/10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white font-bold text-base flex items-center justify-center shadow-soft-sm font-heading flex-shrink-0">
                      {userDetail.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-extrabold text-base text-text-main">
                          {userDetail.user.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            userDetail.user.role === 'admin'
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {userDetail.user.role}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary mt-1">{userDetail.user.email}</div>
                      <div className="text-[11px] text-text-secondary mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-text-secondary" />
                        <span>
                          Member since {new Date(userDetail.user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Associated Inquiries */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-heading font-bold text-sm text-text-main flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Inquiries Submitted ({userDetail.inquiries.length})
                      </h4>
                    </div>

                    {userDetail.inquiries.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-background-alt text-center border border-border">
                        <p className="text-xs text-text-secondary">
                          This user has not submitted any contact inquiries.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {userDetail.inquiries.map((inq) => (
                          <div
                            key={inq._id}
                            className="p-3.5 rounded-xl border border-border bg-white hover:border-primary/40 transition-colors flex items-center justify-between gap-4"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-xs text-text-main truncate">
                                  {inq.service}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-background-alt text-text-secondary uppercase font-semibold">
                                  {inq.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-text-secondary truncate">{inq.message}</p>
                              <div className="text-[10px] text-text-secondary mt-1">
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            <Link
                              to={`/admin/messages/${inq._id}`}
                              className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary text-text-secondary transition-colors"
                              title="View full inquiry"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-xs text-text-secondary">
                  Failed to load details.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-background-alt/50 flex justify-end">
              <button
                onClick={handleCloseDetail}
                className="px-4 py-2 rounded-xl border border-border bg-white text-xs font-bold text-text-main hover:bg-background-alt transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 7. Email Composer Modal */}
      <EmailComposerModal
        isOpen={emailModal.isOpen}
        initialRecipient={emailModal.recipient}
        initialRecipientName={emailModal.recipientName}
        userId={emailModal.userId}
        onClose={() => setEmailModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={() => fetchUsers(pagination.page)}
      />
    </div>
  );
};
