import React, { useState, useEffect, useCallback } from 'react';
import {
  MonitorPlay,
  Plus,
  Search,
  AlertCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  apiGetAdminDemos,
  apiCreateAdminDemo,
  apiUpdateAdminDemo,
  apiTogglePublishDemo,
  apiDeleteAdminDemo,
  apiSearchUsersForDemo,
  DemoItem,
  PaginationData,
  CreateDemoPayload,
} from '../../services/api';
import { useLocation } from 'react-router-dom';

const DEMO_CATEGORIES = [
  'Custom Solution',
  'CRM & Business Management',
  'School Management System',
  'Hospital Management System',
  'E-Commerce & Inventory',
  'AI & Automation Workflow',
  'Web Application Prototype',
  'Mobile App Preview',
];

export const AdminDemos: React.FC = () => {
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemoId, setEditingDemoId] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateDemoPayload>({
    title: '',
    description: '',
    category: 'Custom Solution',
    thumbnail: '',
    demoUrl: '',
    videoUrl: '',
    attachmentName: '',
    attachmentUrl: '',
    recipientUserId: '',
    status: 'published',
    adminMessage: '',
    privateAdminNotes: '',
    expiresAt: '',
  });

  // User Search Autocomplete for Recipient Selection
  const [recipientQuery, setRecipientQuery] = useState('');
  const [recipientResults, setRecipientResults] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    company?: string;
  }>>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // Delete modal confirmation
  const [deleteDemoTarget, setDeleteDemoTarget] = useState<DemoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const location = useLocation();

  const fetchDemos = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await apiGetAdminDemos({
          page,
          limit: 10,
          search: searchTerm,
          status: statusFilter,
        });

        if (res.success && res.data) {
          setDemos(res.data.demos);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch admin demos:', err);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter]
  );

  useEffect(() => {
    fetchDemos(1);
  }, [fetchDemos]);

  // Handle URL query to pre-open "Share Demo" for a specific user (from /admin/users/:id)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefillUserId = params.get('prefillUser');
    const prefillUserName = params.get('userName');
    const prefillUserEmail = params.get('userEmail');

    if (prefillUserId) {
      setSelectedRecipient({
        id: prefillUserId,
        name: prefillUserName || 'Selected User',
        email: prefillUserEmail || '',
      });
      setFormData((prev) => ({ ...prev, recipientUserId: prefillUserId }));
      setIsModalOpen(true);
    }
  }, [location.search]);

  // Live user autocomplete search
  useEffect(() => {
    if (!recipientQuery.trim() || selectedRecipient) {
      setRecipientResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const res = await apiSearchUsersForDemo(recipientQuery);
        if (res.success && res.data) {
          setRecipientResults(res.data.users);
        }
      } catch (err) {
        // Silently handle
      } finally {
        setIsSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [recipientQuery, selectedRecipient]);

  const handleOpenAddModal = () => {
    setEditingDemoId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Custom Solution',
      thumbnail: '',
      demoUrl: '',
      videoUrl: '',
      attachmentName: '',
      attachmentUrl: '',
      recipientUserId: '',
      status: 'published',
      adminMessage: '',
      privateAdminNotes: '',
      expiresAt: '',
    });
    setSelectedRecipient(null);
    setRecipientQuery('');
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (demo: DemoItem) => {
    setEditingDemoId(demo._id);
    const recipient =
      typeof demo.recipientUserId === 'object' && demo.recipientUserId !== null
        ? {
            id: (demo.recipientUserId as any)._id || (demo.recipientUserId as any).id,
            name: (demo.recipientUserId as any).name,
            email: (demo.recipientUserId as any).email,
          }
        : {
            id: String(demo.recipientUserId),
            name: 'Client User',
            email: '',
          };

    setSelectedRecipient(recipient);
    setFormData({
      title: demo.title,
      description: demo.description,
      category: demo.category,
      thumbnail: demo.thumbnail || '',
      demoUrl: demo.demoUrl || '',
      videoUrl: demo.videoUrl || '',
      attachmentName: demo.attachmentName || '',
      attachmentUrl: demo.attachmentUrl || '',
      recipientUserId: recipient.id,
      status: demo.status,
      adminMessage: demo.adminMessage || '',
      privateAdminNotes: demo.privateAdminNotes || '',
      expiresAt: demo.expiresAt ? demo.expiresAt.slice(0, 10) : '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientUserId) {
      setModalError('Please explicitly select an intended recipient user.');
      return;
    }
    if (!formData.title.trim() || !formData.demoUrl.trim() || !formData.description.trim()) {
      setModalError('Title, demo URL, and description are required.');
      return;
    }

    setModalSubmitting(true);
    setModalError(null);

    try {
      if (editingDemoId) {
        const res = await apiUpdateAdminDemo(editingDemoId, formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchDemos(pagination.page);
        } else {
          setModalError(res.message || 'Failed to update demo.');
        }
      } else {
        const res = await apiCreateAdminDemo(formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchDemos(1);
        } else {
          setModalError(res.message || 'Failed to share demo.');
        }
      }
    } catch (err: any) {
      setModalError(err.message || 'Network error saving demo.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleTogglePublish = async (demo: DemoItem) => {
    try {
      const res = await apiTogglePublishDemo(demo._id);
      if (res.success) {
        setDemos((prev) =>
          prev.map((d) => (d._id === demo._id ? { ...d, status: res.data?.demo.status || 'published' } : d))
        );
      }
    } catch (e) {
      console.error('Failed to toggle publish status:', e);
    }
  };

  const handleDeleteDemo = async () => {
    if (!deleteDemoTarget) return;
    setIsDeleting(true);
    try {
      const res = await apiDeleteAdminDemo(deleteDemoTarget._id);
      if (res.success) {
        setDeleteDemoTarget(null);
        fetchDemos(pagination.page);
      }
    } catch (e) {
      console.error('Failed to delete demo:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
              Client Demos &amp; Prototypes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-background-lavender text-primary">
              {pagination.total} Shared
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Build, publish, and target custom prototype links specifically to individual client workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDemos(pagination.page)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-white text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
            title="Refresh Demos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft-sm hover:shadow-soft-md transition-all font-heading"
          >
            <Plus className="w-4 h-4" />
            <span>Share Demo with User</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-soft-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary transition-all font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">Filter:</span>
          <div className="flex rounded-xl border border-border p-1 bg-background-alt">
            {[
              { label: 'All', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
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

      {/* 3. Demos Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-soft-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-alt/60 text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading">
                <th className="py-3.5 px-4 sm:px-6">Demo Title &amp; Category</th>
                <th className="py-3.5 px-4">Recipient Client</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Live URL</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-secondary">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <span>Loading shared demos...</span>
                  </td>
                </tr>
              ) : demos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-secondary">
                    <div className="w-12 h-12 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-3">
                      <MonitorPlay className="w-6 h-6" />
                    </div>
                    <div className="font-heading font-bold text-text-main text-base">
                      No Demos Found
                    </div>
                    <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                      Click "Share Demo with User" above to target a prototype directly to a client's dashboard.
                    </p>
                  </td>
                </tr>
              ) : (
                demos.map((demo) => {
                  const recipient =
                    typeof demo.recipientUserId === 'object' && demo.recipientUserId !== null
                      ? (demo.recipientUserId as any)
                      : null;

                  return (
                    <tr key={demo._id} className="hover:bg-background-alt/40 transition-colors">
                      {/* Title & Category */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-heading font-bold text-text-main">
                          {demo.title}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-background-lavender text-primary font-heading">
                          {demo.category}
                        </span>
                      </td>

                      {/* Recipient */}
                      <td className="py-4 px-4">
                        {recipient ? (
                          <div>
                            <div className="font-bold text-text-main text-xs">{recipient.name}</div>
                            <div className="text-[11px] text-text-secondary">{recipient.email}</div>
                            {recipient.company && (
                              <div className="text-[10px] text-text-secondary/80 italic">{recipient.company}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-text-secondary">Unknown User</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(demo)}
                          title="Click to toggle publish status"
                          className="focus:outline-none"
                        >
                          {demo.status === 'published' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                              <span>Draft</span>
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Live Demo URL */}
                      <td className="py-4 px-4">
                        <a
                          href={demo.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono truncate max-w-[180px]"
                        >
                          <span className="truncate">{demo.demoUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-text-secondary whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(demo.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(demo)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-background-lavender transition-colors"
                            title="Edit Demo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteDemoTarget(demo)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Demo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing page <span className="font-bold text-text-main">{pagination.page}</span> of{' '}
              <span className="font-bold text-text-main">{pagination.totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchDemos(pagination.page - 1)}
                className="px-3 py-1.5 rounded-lg border border-border text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background-alt"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchDemos(pagination.page + 1)}
                className="px-3 py-1.5 rounded-lg border border-border text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background-alt"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Demo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/30 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-heading">
                  Interactive Prototyping
                </span>
                <h3 className="text-lg font-black font-heading text-text-main">
                  {editingDemoId ? 'Edit Shared Demo' : 'Share Prototype with User'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border border-border hover:bg-background-alt text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
              {modalError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Recipient User Picker */}
              <div className="p-4 bg-background-lavender/40 border border-primary/20 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider font-heading">
                  Target Recipient User <span className="text-primary">*</span>
                </label>

                {selectedRecipient ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border shadow-soft-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center font-heading">
                        {selectedRecipient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-text-main">{selectedRecipient.name}</div>
                        <div className="text-[11px] text-text-secondary">{selectedRecipient.email}</div>
                      </div>
                    </div>

                    {!editingDemoId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecipient(null);
                          setFormData((prev) => ({ ...prev, recipientUserId: '' }));
                        }}
                        className="text-xs text-rose-600 font-semibold hover:underline"
                      >
                        Change
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search registered user by name, email, or company..."
                      value={recipientQuery}
                      onChange={(e) => setRecipientQuery(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary shadow-soft-xs"
                    />

                    {isSearchingUsers && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    )}

                    {recipientResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-soft-lg z-20 max-h-48 overflow-y-auto divide-y divide-border">
                        {recipientResults.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setSelectedRecipient(u);
                              setFormData((prev) => ({ ...prev, recipientUserId: u.id }));
                              setRecipientQuery('');
                              setRecipientResults([]);
                            }}
                            className="p-3 hover:bg-background-lavender/50 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <div className="font-bold text-xs text-text-main">{u.name}</div>
                              <div className="text-[11px] text-text-secondary">{u.email}</div>
                            </div>
                            {u.company && (
                              <span className="text-[10px] text-text-secondary bg-background-alt px-2 py-0.5 rounded-md">
                                {u.company}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Demo Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Apex Hospital OPD Portal V1"
                    className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Category <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary"
                  >
                    {DEMO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Demo URL & Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Interactive Demo URL <span className="text-primary">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://client-demo.anthix.dev"
                    className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Optional Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://loom.com/share/... or YouTube"
                    className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                  Demo Description &amp; Scope <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain what the client can interact with in this prototype..."
                  className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Message to User */}
              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                  Message for the Client (Visible in Client Dashboard)
                </label>
                <textarea
                  rows={2}
                  value={formData.adminMessage}
                  onChange={(e) => setFormData({ ...formData, adminMessage: e.target.value })}
                  placeholder="e.g. Here is the custom school dashboard we built based on our discussion."
                  className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Private Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading flex items-center justify-between">
                  <span>Internal Admin Notes (Strictly Hidden from Client)</span>
                  <span className="text-[10px] text-primary font-semibold">Admin-only</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.privateAdminNotes}
                  onChange={(e) => setFormData({ ...formData, privateAdminNotes: e.target.value })}
                  placeholder="Internal notes on client feedback, credentials, staging server details..."
                  className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Status & Expiration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })
                    }
                    className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary"
                  >
                    <option value="published">Published (Visible to Client)</option>
                    <option value="draft">Draft (Hidden from Client)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Optional Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-2 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-text-secondary hover:text-text-main hover:bg-background-alt"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft-xs"
                >
                  {modalSubmitting ? 'Saving...' : editingDemoId ? 'Save Changes' : 'Share Demo with User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteDemoTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/30 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-black text-lg text-text-main">
                Delete Demo Access?
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-text-main">"{deleteDemoTarget.title}"</span>? This will permanently remove access from the recipient user's dashboard.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteDemoTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-background-alt"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteDemo}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-soft-xs"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
