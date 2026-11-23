/**
 * Centralized API service for communicating with the ANTHIX backend.
 */

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  profileImage?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  organizationType?: string;
  location?: string;
  website?: string;
  bio?: string;
  interests?: string[];
  profileCompletion?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ContactSubmissionPayload {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  service: string;
  subject?: string;
  message: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiFieldError[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  database: {
    state: string;
    readyState: number;
    connected: boolean;
  };
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface AdminContactMessage {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
  } | string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  service: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'replied' | 'closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  thumbnail: string;
  gallery?: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  featured: boolean;
  status: 'draft' | 'published';
  order: number;
  mockupType?: string;
  surfaceTheme?: string;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailActivityItem {
  _id: string;
  recipient: string;
  recipientName?: string;
  subject: string;
  body: string;
  userId?: { _id: string; name: string; email: string } | string;
  requestId?: string;
  sentBy?: { _id: string; name: string; email: string } | string;
  status: 'sent' | 'failed';
  messageId?: string;
  error?: string;
  createdAt: string;
}

export interface AdminSystemSettings {
  system: {
    environment: string;
    apiPort: number;
    clientOrigin: string;
    serverUptimeSeconds: number;
    nodeVersion: string;
  };
  emailProvider: {
    isConfigured: boolean;
    mode: string;
    host: string;
    sender: string;
  };
  database: {
    connected: boolean;
    state: string;
    readyState?: number;
  };
}

export interface AdminDashboardData {
  stats: {
    totalMessages: number;
    newMessages: number;
    inProgressMessages: number;
    repliedMessages: number;
    closedMessages: number;
    totalUsers: number;
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
  };
  serviceDistribution: Array<{ service: string; count: number }>;
  recentMessages: AdminContactMessage[];
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    inquiriesCount: number;
  }>;
  recentProjects: ProjectItem[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  createdAt: string;
  inquiriesCount: number;
  lastInquiryDate?: string | null;
}

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * Common fetch wrapper that ensures credentials (cookies) are transmitted
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Ensure HttpOnly session cookies are transmitted
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `Request failed with HTTP ${response.status}`,
        errors: Array.isArray(data?.errors) ? data.errors : undefined,
        data: data?.data,
      };
    }

    return {
      success: true,
      message: data?.message || 'Operation successful',
      data: data?.data,
    };
  } catch (error) {
    console.error(`[API Network Error] ${endpoint}:`, error);
    return {
      success: false,
      message: 'Unable to reach the server. Please check your network connection and verify the backend service is running.',
    };
  }
}

// ----------------------------------------------------------------------
// Authentication API
// ----------------------------------------------------------------------

export async function apiRegister(payload: RegisterPayload): Promise<ApiResponse<{ email: string; purpose: string }>> {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiVerifyRegistrationOtp(payload: VerifyOtpPayload): Promise<ApiResponse<{ user: SafeUser; token?: string }>> {
  return apiRequest('/api/auth/verify-registration-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiLogin(payload: LoginPayload): Promise<ApiResponse<{ user: SafeUser; token?: string }>> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiRequestLoginOtp(email: string): Promise<ApiResponse<{ email: string; purpose: string }>> {
  return apiRequest('/api/auth/login/request-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function apiVerifyLoginOtp(payload: VerifyOtpPayload): Promise<ApiResponse<{ user: SafeUser; token?: string }>> {
  return apiRequest('/api/auth/login/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiResendOtp(email: string, purpose: 'registration' | 'login'): Promise<ApiResponse> {
  return apiRequest('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email, purpose }),
  });
}

export async function apiLogout(): Promise<ApiResponse> {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  });
}

export async function apiGetCurrentUser(): Promise<ApiResponse<{ user: SafeUser }>> {
  return apiRequest('/api/auth/me', {
    method: 'GET',
  });
}

// ----------------------------------------------------------------------
// Contact API (Protected for authenticated users)
// ----------------------------------------------------------------------

export async function submitContact(payload: ContactSubmissionPayload): Promise<ApiResponse> {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGetMyContacts(): Promise<ApiResponse<{ contacts: any[] }>> {
  return apiRequest('/api/contact/me', {
    method: 'GET',
  });
}

// ----------------------------------------------------------------------
// Admin API (Protected by requireAdmin)
// ----------------------------------------------------------------------

export async function apiAdminLogin(email: string, password: string): Promise<ApiResponse<{ user: SafeUser; token?: string }>> {
  return apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetAdminDashboard(): Promise<ApiResponse<AdminDashboardData>> {
  return apiRequest('/api/admin/dashboard', {
    method: 'GET',
  });
}

export interface AdminMessagesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  service?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
}

export async function apiGetAdminMessages(
  params: AdminMessagesQueryParams = {}
): Promise<ApiResponse<{ messages: AdminContactMessage[]; pagination: PaginationData }>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.service && params.service !== 'all') query.set('service', params.service);
  if (params.sort) query.set('sort', params.sort);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);

  const qs = query.toString();
  return apiRequest(`/api/admin/messages${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function apiGetAdminMessageById(id: string): Promise<ApiResponse<{ message: AdminContactMessage }>> {
  return apiRequest(`/api/admin/messages/${id}`, {
    method: 'GET',
  });
}

export async function apiUpdateMessageStatus(
  id: string,
  status: 'new' | 'in_progress' | 'replied' | 'closed'
): Promise<ApiResponse<{ message: AdminContactMessage }>> {
  return apiRequest(`/api/admin/messages/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiUpdateMessageNotes(
  id: string,
  notes: string
): Promise<ApiResponse<{ message: AdminContactMessage }>> {
  return apiRequest(`/api/admin/messages/${id}/notes`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  });
}

export async function apiDeleteMessage(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/admin/messages/${id}`, {
    method: 'DELETE',
  });
}

export async function apiGetAdminUsers(
  page = 1,
  limit = 15,
  search = ''
): Promise<ApiResponse<{ users: AdminUser[]; pagination: PaginationData }>> {
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (search) query.set('search', search);

  return apiRequest(`/api/admin/users?${query.toString()}`, {
    method: 'GET',
  });
}

export async function apiGetAdminUserById(
  id: string
): Promise<ApiResponse<{ user: SafeUser; inquiries: AdminContactMessage[] }>> {
  return apiRequest(`/api/admin/users/${id}`, {
    method: 'GET',
  });
}

// ----------------------------------------------------------------------
// Project APIs (Public & Admin)
// ----------------------------------------------------------------------

export async function apiGetPublishedProjects(): Promise<ApiResponse<{ projects: ProjectItem[] }>> {
  return apiRequest('/api/projects', { method: 'GET' });
}

export async function apiGetPublishedProjectById(
  idOrSlug: string
): Promise<ApiResponse<{ project: ProjectItem }>> {
  return apiRequest(`/api/projects/${idOrSlug}`, { method: 'GET' });
}

export async function apiGetAdminProjects(
  page = 1,
  limit = 20,
  search = '',
  status = 'all',
  category = 'all'
): Promise<ApiResponse<{ projects: ProjectItem[]; pagination: PaginationData }>> {
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (search) query.set('search', search);
  if (status && status !== 'all') query.set('status', status);
  if (category && category !== 'all') query.set('category', category);

  return apiRequest(`/api/admin/projects?${query.toString()}`, { method: 'GET' });
}

export async function apiGetAdminProjectById(id: string): Promise<ApiResponse<{ project: ProjectItem }>> {
  return apiRequest(`/api/admin/projects/${id}`, { method: 'GET' });
}

export async function apiCreateProject(
  data: Partial<ProjectItem>
): Promise<ApiResponse<{ project: ProjectItem }>> {
  return apiRequest('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateProject(
  id: string,
  data: Partial<ProjectItem>
): Promise<ApiResponse<{ project: ProjectItem }>> {
  return apiRequest(`/api/admin/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function apiTogglePublishProject(
  id: string
): Promise<ApiResponse<{ project: ProjectItem }>> {
  return apiRequest(`/api/admin/projects/${id}/publish`, {
    method: 'PATCH',
  });
}

export async function apiDeleteProject(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  });
}

// ----------------------------------------------------------------------
// Direct Emailing & Communication APIs
// ----------------------------------------------------------------------

export interface SendEmailPayload {
  to: string;
  recipientName?: string;
  subject: string;
  body: string;
  userId?: string;
  requestId?: string;
}

export async function apiSendClientEmail(
  payload: SendEmailPayload
): Promise<ApiResponse<{ activity: EmailActivityItem }>> {
  return apiRequest('/api/admin/email/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGetEmailActivities(
  page = 1,
  limit = 20
): Promise<ApiResponse<{ activities: EmailActivityItem[]; pagination: PaginationData }>> {
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));

  return apiRequest(`/api/admin/email/activities?${query.toString()}`, { method: 'GET' });
}

export async function apiGetRequestEmailHistory(
  requestId: string
): Promise<ApiResponse<{ activities: EmailActivityItem[] }>> {
  return apiRequest(`/api/admin/email/history/${requestId}`, { method: 'GET' });
}

export async function apiGetUserEmailHistory(
  userId: string
): Promise<ApiResponse<{ activities: EmailActivityItem[] }>> {
  return apiRequest(`/api/admin/email/user-history/${userId}`, { method: 'GET' });
}

// ----------------------------------------------------------------------
// System Settings API
// ----------------------------------------------------------------------

export async function apiGetAdminSettings(): Promise<ApiResponse<AdminSystemSettings>> {
  return apiRequest('/api/admin/settings', { method: 'GET' });
}

export function getExportMessagesCsvUrl(params: AdminMessagesQueryParams = {}): string {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.service && params.service !== 'all') query.set('service', params.service);

  const qs = query.toString();
  return `${API_BASE_URL}/api/admin/export/messages${qs ? `?${qs}` : ''}`;
}

// ----------------------------------------------------------------------
// Health API (Public)
// ----------------------------------------------------------------------

export async function getHealthStatus(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[API Health Check Error]:', err);
    return null;
  }
}

// ----------------------------------------------------------------------
// User Dashboard & Demos Interfaces & APIs
// ----------------------------------------------------------------------

export interface UserDashboardStats {
  totalRequests: number;
  inProgressRequests: number;
  totalDemos: number;
  unreadNotifications: number;
}

export interface DemoItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  demoUrl: string;
  videoUrl?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  recipientUserId?: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    company?: string;
    role?: string;
    profileImage?: string;
  } | string;
  status: 'draft' | 'published';
  adminMessage?: string;
  privateAdminNotes?: string;
  expiresAt?: string;
  isExpired?: boolean;
  createdByAdminId?: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  } | string;
  viewedByUserAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  _id: string;
  recipientUserId: string;
  type: 'demo_shared' | 'demo_updated' | 'request_status' | 'system';
  title: string;
  message: string;
  relatedDemoId?: string;
  relatedRequestId?: string;
  link?: string;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  organizationType?: string;
  location?: string;
  website?: string;
  bio?: string;
  interests?: string[];
}

export interface CreateDemoPayload {
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  demoUrl: string;
  videoUrl?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  recipientUserId: string;
  status?: 'draft' | 'published';
  adminMessage?: string;
  privateAdminNotes?: string;
  expiresAt?: string;
}

// User-Facing Dashboard APIs
export async function apiGetUserProfile(): Promise<
  ApiResponse<{ user: SafeUser; stats: UserDashboardStats }>
> {
  return apiRequest('/api/users/me', { method: 'GET' });
}

export async function apiUpdateUserProfile(
  payload: UpdateProfilePayload
): Promise<ApiResponse<{ user: SafeUser }>> {
  return apiRequest('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function apiUploadUserAvatar(
  base64Image: string
): Promise<ApiResponse<{ avatarUrl: string; user: SafeUser }>> {
  return apiRequest('/api/users/me/avatar', {
    method: 'POST',
    body: JSON.stringify({ image: base64Image }),
  });
}

export async function apiRemoveUserAvatar(): Promise<ApiResponse<{ user: SafeUser }>> {
  return apiRequest('/api/users/me/avatar', { method: 'DELETE' });
}

export async function apiGetUserRequests(): Promise<
  ApiResponse<{ requests: AdminContactMessage[]; total: number }>
> {
  return apiRequest('/api/users/me/requests', { method: 'GET' });
}

export async function apiGetUserRequestById(
  id: string
): Promise<ApiResponse<{ request: AdminContactMessage }>> {
  return apiRequest(`/api/users/me/requests/${id}`, { method: 'GET' });
}

export async function apiGetUserDemos(): Promise<
  ApiResponse<{ demos: DemoItem[]; total: number }>
> {
  return apiRequest('/api/users/me/demos', { method: 'GET' });
}

export async function apiGetUserDemoById(
  id: string
): Promise<ApiResponse<{ demo: DemoItem }>> {
  return apiRequest(`/api/users/me/demos/${id}`, { method: 'GET' });
}

export async function apiGetUserNotifications(): Promise<
  ApiResponse<{ notifications: NotificationItem[]; unreadCount: number }>
> {
  return apiRequest('/api/users/me/notifications', { method: 'GET' });
}

export async function apiMarkNotificationRead(
  id: string
): Promise<ApiResponse<{ notification: NotificationItem }>> {
  return apiRequest(`/api/users/me/notifications/${id}/read`, { method: 'PATCH' });
}

export async function apiMarkAllNotificationsRead(): Promise<ApiResponse> {
  return apiRequest('/api/users/me/notifications/read-all', { method: 'PATCH' });
}

// Admin-Facing Demos APIs
export async function apiGetAdminDemos(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
  } = {}
): Promise<ApiResponse<{ demos: DemoItem[]; pagination: PaginationData }>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.userId) query.set('userId', params.userId);

  return apiRequest(`/api/admin/demos?${query.toString()}`, { method: 'GET' });
}

export async function apiGetAdminDemoById(
  id: string
): Promise<ApiResponse<{ demo: DemoItem }>> {
  return apiRequest(`/api/admin/demos/${id}`, { method: 'GET' });
}

export async function apiCreateAdminDemo(
  payload: CreateDemoPayload
): Promise<ApiResponse<{ demo: DemoItem }>> {
  return apiRequest('/api/admin/demos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateAdminDemo(
  id: string,
  payload: Partial<CreateDemoPayload>
): Promise<ApiResponse<{ demo: DemoItem }>> {
  return apiRequest(`/api/admin/demos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function apiTogglePublishDemo(
  id: string
): Promise<ApiResponse<{ demo: DemoItem }>> {
  return apiRequest(`/api/admin/demos/${id}/publish`, { method: 'PATCH' });
}

export async function apiDeleteAdminDemo(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/admin/demos/${id}`, { method: 'DELETE' });
}

export async function apiSearchUsersForDemo(
  query: string
): Promise<
  ApiResponse<{
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      company?: string;
      profileImage?: string;
    }>;
  }>
> {
  return apiRequest(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
  });
}
