import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  apiGetAdminProjects,
  apiCreateProject,
  apiUpdateProject,
  apiTogglePublishProject,
  apiDeleteProject,
  ProjectItem,
  PaginationData,
} from '../../services/api';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Business Software',
    technologies: '',
    thumbnail: '',
    gallery: '',
    liveDemoUrl: '',
    sourceCodeUrl: '',
    featured: false,
    status: 'published' as 'draft' | 'published',
    order: 0,
    badge: 'Enterprise Solution',
  });

  const fetchProjects = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    const res = await apiGetAdminProjects(page, 15, search.trim(), status, category);
    if (!res.success || !res.data) {
      setError(res.message || 'Failed to fetch projects.');
      setIsLoading(false);
      return;
    }

    setProjects(res.data.projects);
    setPagination(res.data.pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects(1);
  }, [status, category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects(1);
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      category: 'Business Software',
      technologies: 'React, TypeScript, Node.js, Tailwind CSS',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      gallery: '',
      liveDemoUrl: '',
      sourceCodeUrl: '',
      featured: false,
      status: 'published',
      order: 0,
      badge: 'Project Solution',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      shortDescription: proj.shortDescription,
      description: proj.description,
      category: proj.category,
      technologies: proj.technologies ? proj.technologies.join(', ') : '',
      thumbnail: proj.thumbnail || '',
      gallery: proj.gallery ? proj.gallery.join(', ') : '',
      liveDemoUrl: proj.liveDemoUrl || '',
      sourceCodeUrl: proj.sourceCodeUrl || '',
      featured: proj.featured,
      status: proj.status,
      order: proj.order || 0,
      badge: proj.badge || 'Project Solution',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.description.trim()) {
      alert('Please fill in project title, short description, and full description.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      thumbnail: formData.thumbnail.trim(),
      gallery: formData.gallery
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      liveDemoUrl: formData.liveDemoUrl.trim(),
      sourceCodeUrl: formData.sourceCodeUrl.trim(),
      featured: formData.featured,
      status: formData.status,
      order: Number(formData.order) || 0,
      badge: formData.badge.trim(),
    };

    let res;
    if (editingProject) {
      res = await apiUpdateProject(editingProject._id, payload);
    } else {
      res = await apiCreateProject(payload);
    }

    setIsSubmitting(false);

    if (!res.success) {
      alert(res.message || 'Operation failed.');
      return;
    }

    setIsModalOpen(false);
    showNotification(
      editingProject
        ? `Project "${payload.title}" updated successfully.`
        : `Project "${payload.title}" created successfully and published to live catalog.`
    );
    fetchProjects(pagination.page);
  };

  const handleTogglePublish = async (proj: ProjectItem) => {
    const res = await apiTogglePublishProject(proj._id);
    if (!res.success) {
      alert(res.message || 'Failed to toggle status.');
      return;
    }
    const newStatus = proj.status === 'published' ? 'draft' : 'published';
    showNotification(
      newStatus === 'published'
        ? `"${proj.title}" is now PUBLISHED and visible on the public website.`
        : `"${proj.title}" is now saved as DRAFT (hidden from public website).`
    );
    fetchProjects(pagination.page);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmProject) return;

    setIsDeleting(true);
    const res = await apiDeleteProject(deleteConfirmProject._id);
    setIsDeleting(false);

    if (!res.success) {
      alert(res.message || 'Failed to delete project.');
      return;
    }

    const title = deleteConfirmProject.title;
    setDeleteConfirmProject(null);
    showNotification(`Project "${title}" has been permanently deleted.`);
    fetchProjects(pagination.page);
  };

  const categories = [
    'Business Software',
    'Education Technology',
    'Healthcare Technology',
    'Social Impact Technology',
    'Commerce Technology',
    'AI & Automation',
    'Custom Platform',
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-soft-lg flex items-center gap-2.5 text-xs font-semibold animate-slide-down">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight">
            Projects Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Publish, edit, organize, or draft projects displayed on the public ANTHIX website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-soft-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-border shadow-soft-sm flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search projects by title, category, or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-background-alt border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts Only</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-background-alt border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
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

      {/* 4. Projects Grid / Table */}
      <div className="bg-white rounded-2xl border border-border shadow-soft-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm text-text-secondary font-medium">Loading project catalog...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <FolderKanban className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text-main mb-1">
              No projects found
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto mb-4">
              {search || status !== 'all' || category !== 'all'
                ? 'No projects match your active search and filter criteria.'
                : 'No projects have been added to the database yet.'}
            </p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main">
              <thead className="bg-background-alt/70 text-text-secondary text-xs font-heading font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-6">Project</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Technologies</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Updated</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-background-alt/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {proj.thumbnail ? (
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-12 h-10 object-cover rounded-lg border border-border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-background-lavender text-primary flex items-center justify-center font-bold text-xs border border-primary/20 flex-shrink-0">
                            {proj.title.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-text-main flex items-center gap-1.5">
                            <span className="truncate">{proj.title}</span>
                            {proj.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary truncate max-w-sm mt-0.5">
                            {proj.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background-alt text-text-main border border-border">
                        {proj.category}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.technologies?.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-background-lavender/50 text-primary border border-primary/10 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.technologies?.length > 3 && (
                          <span className="text-[10px] text-text-secondary">
                            +{proj.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        title={`Click to ${proj.status === 'published' ? 'Unpublish' : 'Publish'}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          proj.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            proj.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize">{proj.status}</span>
                      </button>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-xs text-text-secondary">
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(proj)}
                          className="p-2 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors bg-white"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmProject(proj)}
                          className="p-2 rounded-lg border border-border hover:border-rose-300 text-text-secondary hover:text-rose-600 transition-colors bg-white hover:bg-rose-50"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination */}
        {!isLoading && projects.length > 0 && (
          <div className="px-6 py-4 bg-background-alt/50 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing <span className="font-bold text-text-main">{projects.length}</span> of{' '}
              <span className="font-bold text-text-main">{pagination.total}</span> projects
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchProjects(pagination.page - 1)}
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
                onClick={() => fetchProjects(pagination.page + 1)}
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

      {/* 6. Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background-alt/40">
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-text-main">
                  {editingProject ? 'Edit Project Details' : 'Add New Project'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Project Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Hospital Management System"
                    required
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Category <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                  Short Description (Card Summary) <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summarizing the project concept..."
                  required
                  maxLength={300}
                  className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                  Detailed Description <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of capabilities, workflows, and architecture..."
                  required
                  className="w-full p-3.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Technologies Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="e.g. React, TypeScript, Node.js, MongoDB"
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Badge / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Enterprise Solution"
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://demo.anthix.com/crm"
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'draft' | 'published',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden from site)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                    Display Order (Rank)
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                  />
                  <label htmlFor="featured-check" className="text-xs font-bold text-text-main cursor-pointer">
                    Highlight as Featured
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-soft-sm disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving Project...'
                    : editingProject
                    ? 'Update Project'
                    : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Dialog */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-extrabold text-lg text-text-main mb-2">
              Permanently Delete Project?
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              You are about to permanently delete{' '}
              <strong className="text-text-main">"{deleteConfirmProject.title}"</strong>. This will
              remove it from the database and public website catalog immediately. This action cannot be
              undone.
            </p>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmProject(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-main hover:bg-background-alt transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-soft-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
