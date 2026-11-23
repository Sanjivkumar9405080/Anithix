import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Building,
  Phone,
  Briefcase,
  MapPin,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  apiUpdateUserProfile,
  apiUploadUserAvatar,
  apiRemoveUserAvatar,
  UpdateProfilePayload,
} from '../../services/api';

const AVAILABLE_INTERESTS = [
  'Web Applications',
  'CRM & ERP Systems',
  'Education Tech',
  'Healthcare Systems',
  'E-Commerce & Retail',
  'AI & Automation',
  'Cloud Infrastructure',
  'Mobile Apps',
  'Custom Enterprise Software',
];

const ORG_TYPES = [
  'Business',
  'School',
  'College',
  'Hospital',
  'Agency',
  'Startup',
  'Other',
];

export const DashboardProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState<UpdateProfilePayload>({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    organizationType: user?.organizationType || '',
    location: user?.location || '',
    website: user?.website || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
  });

  // Photo states
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        organizationType: user.organizationType || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.bio || '',
        interests: user.interests || [],
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const current = prev.interests || [];
      const updated = current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest];
      return { ...prev, interests: updated };
    });
    setSaveSuccess(false);
  };

  // Avatar file selection & local preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    // Validate size on client first (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError('Image file exceeds the 3MB size limit.');
      return;
    }

    // Validate mime type on client
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setPhotoError('Please select a JPG, PNG, WebP, or GIF image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Save the previewed avatar to backend
  const handleSaveAvatar = async () => {
    if (!previewImage) return;

    setPhotoLoading(true);
    setPhotoError(null);

    try {
      const res = await apiUploadUserAvatar(previewImage);
      if (res.success && res.data) {
        updateUser(res.data.user);
        setPreviewImage(null);
      } else {
        setPhotoError(res.message || 'Failed to upload image.');
      }
    } catch (err: any) {
      setPhotoError(err.message || 'Network error uploading profile photo.');
    } finally {
      setPhotoLoading(false);
    }
  };

  // Remove photo and return to default
  const handleRemoveAvatar = async () => {
    setPhotoLoading(true);
    setPhotoError(null);
    setPreviewImage(null);

    try {
      const res = await apiRemoveUserAvatar();
      if (res.success && res.data) {
        updateUser(res.data.user);
      } else {
        setPhotoError(res.message || 'Failed to remove photo.');
      }
    } catch (err: any) {
      setPhotoError(err.message || 'Network error removing profile photo.');
    } finally {
      setPhotoLoading(false);
    }
  };

  // Submit profile details form
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await apiUpdateUserProfile(formData);
      if (res.success && res.data) {
        updateUser(res.data.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.message || 'Failed to save profile changes.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Network error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const profilePct = user?.profileCompletion ?? 30;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
          Client Profile &amp; Preferences
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your personal details, organization info, and prototype preferences.
        </p>
      </div>

      {/* 2. Profile Photo Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-soft-xs space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-border">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-text-main">
              Profile Photo
            </h2>
            <p className="text-xs text-text-secondary">
              Upload a recognizable photo or company avatar (PNG, JPG, WebP max 3MB).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar display */}
          <div className="relative group">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-primary ring-4 ring-primary/10 shadow-soft-sm"
              />
            ) : user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border border-border shadow-soft-sm"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-primary to-sky-400 text-white font-black text-3xl sm:text-4xl flex items-center justify-center font-heading shadow-soft-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoLoading}
                className="px-4 py-2.5 rounded-xl border border-border bg-white text-text-main font-bold text-xs hover:bg-background-alt transition-colors shadow-soft-xs inline-flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-primary" />
                <span>{user?.profileImage || previewImage ? 'Replace Photo' : 'Upload Photo'}</span>
              </button>

              {previewImage && (
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={photoLoading}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-soft-xs transition-colors inline-flex items-center gap-2"
                >
                  <Save className={`w-4 h-4 ${photoLoading ? 'animate-spin' : ''}`} />
                  <span>{photoLoading ? 'Saving...' : 'Save Photo'}</span>
                </button>
              )}

              {(user?.profileImage || previewImage) && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={photoLoading}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {previewImage && (
              <p className="text-xs text-primary font-medium">
                Photo previewed. Click "Save Photo" above to apply your changes.
              </p>
            )}

            {photoError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{photoError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Profile Information Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-8">
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-soft-xs space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-background-lavender text-primary flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-heading text-text-main">
                  Identity &amp; Organization
                </h2>
                <p className="text-xs text-text-secondary">
                  These details will be used when reviewing your project proposals.
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-text-secondary">Profile Strength</span>
              <div className="text-sm font-black font-heading text-primary">{profilePct}%</div>
            </div>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
              />
            </div>

            {/* Email Address (Read-Only) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider font-heading">
                  Email Address
                </label>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 border border-border rounded-xl text-xs sm:text-sm text-text-secondary cursor-not-allowed font-sans"
                title="Email is fixed to your authenticated login"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
                />
              </div>
            </div>

            {/* Company / Organization Name */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Company / Organization
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Innovations Ltd."
                  className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Job Title / Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Founder &amp; CEO"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
                />
              </div>
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Organization Type
              </label>
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
              >
                <option value="">Select Organization Type...</option>
                {ORG_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans"
                />
              </div>
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Short Bio or Project Context
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell our engineering team a bit about your venture or platform requirements..."
              className="w-full px-4 py-3 bg-background-alt border border-border rounded-xl text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary transition-all font-sans resize-none"
            />
          </div>

          {/* Areas of Interest */}
          <div>
            <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2 font-heading">
              Areas of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.map((interest) => {
                const selected = formData.interests?.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      selected
                        ? 'bg-primary text-white border-primary shadow-soft-xs'
                        : 'bg-background-alt text-text-secondary border-border hover:border-primary/40'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback messages */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">Your profile information has been saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-medium">{saveError}</span>
          </div>
        )}

        {/* Save button bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft-sm hover:shadow-soft-md transition-all disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
