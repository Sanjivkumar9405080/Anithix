import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Contact, ContactStatus } from '../models/Contact';
import { User } from '../models/User';
import { Project, ProjectStatus } from '../models/Project';
import { EmailActivity } from '../models/EmailActivity';
import { Demo } from '../models/Demo';
import { Notification } from '../models/Notification';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';
import { env, isEmailConfigured } from '../config/env';
import { getDBStatus } from '../config/db';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class AdminController {
  /**
   * POST /api/admin/login
   * Dedicated secure login for administrators using email and password
   */
  public static adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = (email || '').toLowerCase().trim();

      if (!normalizedEmail || !password) {
        sendError(res, 'Email and password are required.', 400);
        return;
      }

      // 1. Fetch user including password hash
      const user = await User.findOne({ email: normalizedEmail })
        .select('+passwordHash')
        .exec();

      if (!user) {
        sendError(res, 'Invalid administrator credentials.', 401);
        return;
      }

      // 2. Verify account is an administrator
      if (user.role !== 'admin') {
        sendError(res, 'Access denied. Account does not have administrator privileges.', 403);
        return;
      }

      if (user.accountStatus !== 'active') {
        sendError(res, 'Administrator account is suspended.', 403);
        return;
      }

      // 3. Verify password
      const isMatch = await AuthService.comparePassword(password, user.passwordHash);
      if (!isMatch) {
        sendError(res, 'Invalid administrator credentials.', 401);
        return;
      }

      // 4. Issue authenticated session
      const token = AuthService.generateToken(user);
      AuthService.setAuthCookie(res, token);

      console.log(`[Admin Login] Administrator logged in: ${user.email}`);

      sendSuccess(res, 'Admin authentication successful.', {
        user: user.toSafeObject(),
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/dashboard
   * Returns aggregated statistics from actual database records across projects, users, requests
   */
  public static getDashboard = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const activeFilter = { archived: { $ne: true } };

      // Parallel execution for optimal performance
      const [
        totalMessages,
        newMessages,
        inProgressMessages,
        repliedMessages,
        closedMessages,
        totalUsers,
        totalProjects,
        publishedProjects,
        draftProjects,
        recentMessages,
        recentUsers,
        recentProjects,
        serviceDistributionRaw,
      ] = await Promise.all([
        Contact.countDocuments(activeFilter),
        Contact.countDocuments({ ...activeFilter, status: 'new' }),
        Contact.countDocuments({ ...activeFilter, status: 'in_progress' }),
        Contact.countDocuments({ ...activeFilter, status: 'replied' }),
        Contact.countDocuments({ ...activeFilter, status: 'closed' }),
        User.countDocuments(),
        Project.countDocuments(),
        Project.countDocuments({ status: 'published' }),
        Project.countDocuments({ status: 'draft' }),
        Contact.find(activeFilter)
          .sort({ createdAt: -1 })
          .limit(5)
          .select('-archived -__v')
          .exec(),
        User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('-passwordHash -__v')
          .exec(),
        Project.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('-__v')
          .exec(),
        Contact.aggregate([
          { $match: activeFilter },
          { $group: { _id: '$service', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

      const serviceDistribution = serviceDistributionRaw.map((item) => ({
        service: item._id || 'Other',
        count: item.count,
      }));

      // Map users with inquiry counts
      const enrichedRecentUsers = await Promise.all(
        recentUsers.map(async (u) => {
          const inqCount = await Contact.countDocuments({
            userId: u._id,
            archived: { $ne: true },
          });
          return {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            isEmailVerified: u.isEmailVerified,
            createdAt: u.createdAt,
            inquiriesCount: inqCount,
          };
        })
      );

      sendSuccess(res, 'Dashboard statistics retrieved.', {
        stats: {
          totalMessages,
          newMessages,
          inProgressMessages,
          repliedMessages,
          closedMessages,
          totalUsers,
          totalProjects,
          publishedProjects,
          draftProjects,
        },
        serviceDistribution,
        recentMessages,
        recentUsers: enrichedRecentUsers,
        recentProjects,
      });
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------------------------
  // Project Management (Add, Edit, Publish/Unpublish, Delete)
  // ----------------------------------------------------------------------

  /**
   * GET /api/admin/projects
   * Returns all projects (including drafts) with search, category & status filter
   */
  public static getProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
      const skip = (page - 1) * limit;

      const search = (req.query.search as string || '').trim();
      const status = (req.query.status as string || 'all').trim();
      const category = (req.query.category as string || 'all').trim();

      const filter: any = {};

      if (status !== 'all' && ['draft', 'published'].includes(status)) {
        filter.status = status;
      }

      if (category !== 'all' && category) {
        filter.category = category;
      }

      if (search) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [
          { title: regex },
          { shortDescription: regex },
          { category: regex },
          { technologies: regex },
        ];
      }

      const [total, projects] = await Promise.all([
        Project.countDocuments(filter),
        Project.find(filter)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-__v')
          .exec(),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      sendSuccess(res, 'Projects retrieved successfully.', {
        projects,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/projects/:id
   * Retrieves single project by ID
   */
  public static getProjectById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid project ID format.', 400);
        return;
      }

      const project = await Project.findById(id).select('-__v').exec();
      if (!project) {
        sendError(res, 'Project not found.', 404);
        return;
      }

      sendSuccess(res, 'Project retrieved.', { project });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/admin/projects
   * Creates a new project in MongoDB
   */
  public static createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        title,
        shortDescription,
        description,
        category,
        technologies,
        thumbnail,
        gallery,
        liveDemoUrl,
        sourceCodeUrl,
        featured,
        status,
        order,
        mockupType,
        surfaceTheme,
        badge,
      } = req.body;

      if (!title || !shortDescription || !description || !category) {
        sendError(res, 'Title, short description, detailed description, and category are required.', 400);
        return;
      }

      // Generate base slug from title
      let baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!baseSlug) baseSlug = `project-${Date.now()}`;

      // Check for slug uniqueness
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Project.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      const project = await Project.create({
        title: title.trim(),
        slug: uniqueSlug,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        category: category.trim(),
        technologies: Array.isArray(technologies) ? technologies.map((t: string) => t.trim()) : [],
        thumbnail: thumbnail ? thumbnail.trim() : '',
        gallery: Array.isArray(gallery) ? gallery.map((g: string) => g.trim()) : [],
        liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : '',
        sourceCodeUrl: sourceCodeUrl ? sourceCodeUrl.trim() : '',
        featured: Boolean(featured),
        status: status === 'draft' ? 'draft' : 'published',
        order: typeof order === 'number' ? order : 0,
        mockupType: mockupType || '',
        surfaceTheme: surfaceTheme || 'violet-lavender',
        badge: badge ? badge.trim() : 'Project Concept',
      });

      console.log(`[Admin Action] Project created: "${project.title}" (Status: ${project.status}) by ${req.user?.email}`);

      sendSuccess(res, 'Project created successfully.', { project }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/projects/:id
   * Updates an existing project
   */
  public static updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid project ID format.', 400);
        return;
      }

      const updateData: any = { ...req.body };
      delete updateData._id;
      delete updateData.createdAt;

      // Ensure technologies and gallery are arrays if provided
      if (updateData.technologies && !Array.isArray(updateData.technologies)) {
        updateData.technologies = [String(updateData.technologies)];
      }

      const updated = await Project.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-__v');

      if (!updated) {
        sendError(res, 'Project not found.', 404);
        return;
      }

      console.log(`[Admin Action] Project updated: "${updated.title}" by ${req.user?.email}`);

      sendSuccess(res, 'Project updated successfully.', { project: updated });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/projects/:id/publish
   * Toggles publish status between 'published' and 'draft'
   */
  public static togglePublishProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid project ID format.', 400);
        return;
      }

      const project = await Project.findById(id);
      if (!project) {
        sendError(res, 'Project not found.', 404);
        return;
      }

      const newStatus: ProjectStatus = project.status === 'published' ? 'draft' : 'published';
      project.status = newStatus;
      await project.save();

      console.log(`[Admin Action] Project "${project.title}" status changed to ${newStatus} by ${req.user?.email}`);

      sendSuccess(
        res,
        `Project successfully ${newStatus === 'published' ? 'published' : 'unpublished'}.`,
        { project }
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/admin/projects/:id
   * Permanently deletes a project
   */
  public static deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid project ID format.', 400);
        return;
      }

      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        sendError(res, 'Project not found.', 404);
        return;
      }

      console.log(`[Admin Action] Project permanently deleted: "${deleted.title}" by ${req.user?.email}`);

      sendSuccess(res, 'Project deleted permanently.');
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------------------------
  // Direct Client Emailing & Communication Logging
  // ----------------------------------------------------------------------

  /**
   * POST /api/admin/email/send
   * Sends an email directly to a client and logs the activity
   */
  public static sendEmailToClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { to, recipientName, subject, body, userId, requestId } = req.body;

      const normalizedTo = (to || '').toLowerCase().trim();
      if (!normalizedTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedTo)) {
        sendError(res, 'A valid recipient email address is required.', 400);
        return;
      }

      if (!subject || !subject.trim()) {
        sendError(res, 'Email subject is required.', 400);
        return;
      }

      if (!body || !body.trim()) {
        sendError(res, 'Email body content is required.', 400);
        return;
      }

      let validUserId = null;
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        validUserId = new mongoose.Types.ObjectId(userId);
      }

      let validRequestId = null;
      if (requestId && mongoose.Types.ObjectId.isValid(requestId)) {
        validRequestId = new mongoose.Types.ObjectId(requestId);
      }

      let messageId = '';
      let deliveryStatus: 'sent' | 'failed' = 'sent';
      let deliveryError = '';

      try {
        const result = await EmailService.sendCustomEmail(
          normalizedTo,
          recipientName ? recipientName.trim() : '',
          subject.trim(),
          body.trim()
        );
        messageId = result.messageId;
      } catch (err: any) {
        deliveryStatus = 'failed';
        deliveryError = err.message || 'Email delivery failed.';
      }

      // Record in EmailActivity collection
      const activity = await EmailActivity.create({
        recipient: normalizedTo,
        recipientName: recipientName ? recipientName.trim() : '',
        subject: subject.trim(),
        body: body.trim(),
        userId: validUserId,
        requestId: validRequestId,
        sentBy: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null,
        status: deliveryStatus,
        messageId,
        error: deliveryError,
      });

      if (deliveryStatus === 'failed') {
        sendError(
          res,
          `Failed to deliver email: ${deliveryError}. Please verify SMTP credentials.`,
          500,
          [{ field: 'email', message: deliveryError }]
        );
        return;
      }

      // If associated with a request, update its status to 'replied'
      if (validRequestId) {
        await Contact.findByIdAndUpdate(validRequestId, { status: 'replied' });
      }

      console.log(`[Admin Action] Email successfully dispatched to ${normalizedTo} by ${req.user?.email}`);

      sendSuccess(res, 'Email dispatched successfully to client.', { activity });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/email/activities
   * Returns paginated list of email activities
   */
  public static getEmailActivities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
      const skip = (page - 1) * limit;

      const [total, activities] = await Promise.all([
        EmailActivity.countDocuments(),
        EmailActivity.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email')
          .populate('sentBy', 'name email')
          .select('-__v')
          .exec(),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      sendSuccess(res, 'Email activities retrieved.', {
        activities,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/email/history/:requestId
   * Returns communication history for a specific inquiry
   */
  public static getEmailHistoryForRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        sendError(res, 'Invalid request ID.', 400);
        return;
      }

      const activities = await EmailActivity.find({ requestId })
        .sort({ createdAt: -1 })
        .populate('sentBy', 'name email')
        .select('-__v')
        .exec();

      sendSuccess(res, 'Request email history retrieved.', { activities });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/email/user-history/:userId
   * Returns communication history for a specific user
   */
  public static getEmailHistoryForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        sendError(res, 'Invalid user ID.', 400);
        return;
      }

      const activities = await EmailActivity.find({ userId })
        .sort({ createdAt: -1 })
        .populate('sentBy', 'name email')
        .select('-__v')
        .exec();

      sendSuccess(res, 'User email history retrieved.', { activities });
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------------------------
  // Inquiries / Client Requests Management
  // ----------------------------------------------------------------------

  /**
   * GET /api/admin/messages (and /api/admin/requests)
   * Returns paginated contact inquiries with search, filters, and sorting
   */
  public static getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 15));
      const skip = (page - 1) * limit;

      const search = (req.query.search as string || '').trim();
      const status = (req.query.status as string || 'all').trim();
      const service = (req.query.service as string || 'all').trim();
      const sort = (req.query.sort as string || 'newest').trim();

      const filter: any = { archived: { $ne: true } };

      if (status !== 'all' && ['new', 'in_progress', 'replied', 'closed'].includes(status)) {
        filter.status = status;
      }

      if (service !== 'all' && service) {
        filter.service = service;
      }

      if (search) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const searchConditions: any[] = [
          { name: regex },
          { email: regex },
          { organization: regex },
          { message: regex },
          { subject: regex },
        ];

        if (mongoose.Types.ObjectId.isValid(search)) {
          searchConditions.push({ _id: new mongoose.Types.ObjectId(search) });
        }

        filter.$or = searchConditions;
      }

      const sortOption: any = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

      const [total, messages] = await Promise.all([
        Contact.countDocuments(filter),
        Contact.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email role')
          .select('-archived -__v')
          .exec(),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      sendSuccess(res, 'Inquiries retrieved successfully.', {
        messages,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/messages/:id (and /api/admin/requests/:id)
   * Returns complete inquiry details including admin notes
   */
  public static getMessageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid inquiry ID format.', 400);
        return;
      }

      const message = await Contact.findOne({ _id: id, archived: { $ne: true } })
        .populate('userId', 'name email role createdAt')
        .select('-archived -__v')
        .exec();

      if (!message) {
        sendError(res, 'Inquiry not found.', 404);
        return;
      }

      // Also retrieve email activities linked to this request
      const emailActivities = await EmailActivity.find({ requestId: id })
        .sort({ createdAt: -1 })
        .populate('sentBy', 'name email')
        .select('-__v')
        .exec();

      sendSuccess(res, 'Inquiry details retrieved.', {
        message,
        emailActivities,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/messages/:id/status
   */
  public static updateMessageStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid inquiry ID format.', 400);
        return;
      }

      const allowedStatuses: ContactStatus[] = ['new', 'in_progress', 'replied', 'closed'];
      if (!allowedStatuses.includes(status)) {
        sendError(res, `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`, 400);
        return;
      }

      const updated = await Contact.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).select('-archived -__v');

      if (!updated) {
        sendError(res, 'Inquiry not found.', 404);
        return;
      }

      console.log(`[Admin Action] Message #${id} status updated to '${status}' by admin: ${req.user?.email}`);

      sendSuccess(res, `Inquiry status updated to ${status}.`, { message: updated });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/messages/:id/notes
   */
  public static updateMessageNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid inquiry ID format.', 400);
        return;
      }

      if (typeof notes !== 'string') {
        sendError(res, 'Notes must be a string.', 400);
        return;
      }

      if (notes.length > 5000) {
        sendError(res, 'Notes cannot exceed 5000 characters.', 400);
        return;
      }

      const updated = await Contact.findByIdAndUpdate(
        id,
        { adminNotes: notes.trim() },
        { new: true }
      ).select('-archived -__v');

      if (!updated) {
        sendError(res, 'Inquiry not found.', 404);
        return;
      }

      sendSuccess(res, 'Admin notes saved successfully.', { message: updated });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/admin/messages/:id
   */
  public static deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid inquiry ID format.', 400);
        return;
      }

      const updated = await Contact.findByIdAndUpdate(id, { archived: true }, { new: true });

      if (!updated) {
        sendError(res, 'Inquiry not found.', 404);
        return;
      }

      console.log(`[Admin Action] Message #${id} archived by admin: ${req.user?.email}`);

      sendSuccess(res, 'Inquiry archived successfully.');
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------------------------
  // Clients / Users Directory & Profiles
  // ----------------------------------------------------------------------

  /**
   * GET /api/admin/users
   */
  public static getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 15));
      const skip = (page - 1) * limit;
      const search = (req.query.search as string || '').trim();

      const filter: any = {};
      if (search) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ name: regex }, { email: regex }];
      }

      const [total, rawUsers] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-passwordHash -__v')
          .exec(),
      ]);

      const users = await Promise.all(
        rawUsers.map(async (u) => {
          const [inquiriesCount, latestContact] = await Promise.all([
            Contact.countDocuments({ userId: u._id, archived: { $ne: true } }),
            Contact.findOne({ userId: u._id, archived: { $ne: true } })
              .sort({ createdAt: -1 })
              .select('createdAt')
              .exec(),
          ]);

          return {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role || 'user',
            isEmailVerified: u.isEmailVerified,
            accountStatus: u.accountStatus,
            createdAt: u.createdAt,
            inquiriesCount,
            lastInquiryDate: latestContact?.createdAt || null,
          };
        })
      );

      const totalPages = Math.ceil(total / limit) || 1;

      sendSuccess(res, 'Users retrieved successfully.', {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/users/:id
   */
  public static getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid user ID format.', 400);
        return;
      }

      const user = await User.findById(id).select('-passwordHash -__v').exec();
      if (!user) {
        sendError(res, 'User not found.', 404);
        return;
      }

      // Also search by email fallback in case older contact records exist before account linking
      const [inquiries, emailActivities, demos] = await Promise.all([
        Contact.find({
          $or: [{ userId: id }, { email: user.email.toLowerCase() }],
          archived: { $ne: true },
        })
          .sort({ createdAt: -1 })
          .select('-__v')
          .exec(),
        EmailActivity.find({
          $or: [{ userId: id }, { recipient: user.email.toLowerCase() }],
        })
          .sort({ createdAt: -1 })
          .populate('sentBy', 'name email')
          .select('-__v')
          .exec(),
        Demo.find({ recipientUserId: id })
          .sort({ createdAt: -1 })
          .populate('createdByAdminId', 'name email')
          .select('-__v')
          .exec(),
      ]);

      sendSuccess(res, 'User details and inquiries retrieved.', {
        user: user.toSafeObject(),
        inquiries,
        emailActivities,
        demos,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/settings
   * Returns administrative configuration, SMTP delivery state, and DB health
   */
  public static getSettings = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const hasSmtp = isEmailConfigured();
      const dbStatus = getDBStatus();

      sendSuccess(res, 'Admin system settings retrieved.', {
        system: {
          environment: env.NODE_ENV,
          apiPort: env.PORT,
          clientOrigin: env.CLIENT_URL,
          serverUptimeSeconds: Math.floor(process.uptime()),
          nodeVersion: process.version,
        },
        emailProvider: {
          isConfigured: hasSmtp,
          mode: hasSmtp ? 'Active SMTP' : 'Development Mock Logger',
          host: env.EMAIL_HOST ? `${env.EMAIL_HOST}:${env.EMAIL_PORT}` : env.EMAIL_SERVICE ? `${env.EMAIL_SERVICE} service` : 'Not configured (Mock)',
          sender: env.EMAIL_FROM,
        },
        database: {
          connected: dbStatus.connected,
          state: dbStatus.state,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/export/messages
   */
  public static exportMessagesCsv = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const search = (req.query.search as string || '').trim();
      const status = (req.query.status as string || '').trim();
      const service = (req.query.service as string || '').trim();

      const filter: any = { archived: { $ne: true } };

      if (status && status !== 'all' && ['new', 'in_progress', 'replied', 'closed'].includes(status)) {
        filter.status = status;
      }

      if (service && service !== 'all') {
        filter.service = service;
      }

      if (search) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [
          { name: regex },
          { email: regex },
          { organization: regex },
          { message: regex },
          { subject: regex },
        ];
      }

      const inquiries = await Contact.find(filter)
        .sort({ createdAt: -1 })
        .populate('userId', 'name email')
        .select('-archived -__v')
        .lean()
        .exec();

      // Escape helper against CSV Formula Injection (=, +, -, @)
      const sanitizeCell = (text: any): string => {
        if (text === null || text === undefined) return '""';
        let val = String(text).replace(/"/g, '""').trim();
        if (/^[=+\-@\t\r]/.test(val)) {
          val = `'${val}`;
        }
        return `"${val}"`;
      };

      const headers = [
        'ID',
        'Status',
        'Created At',
        'Client Name',
        'Client Email',
        'Phone',
        'Organization',
        'Service Requested',
        'Subject',
        'Message',
        'Admin Notes',
      ];

      const rows = inquiries.map((inq: any) => [
        sanitizeCell(inq._id),
        sanitizeCell(inq.status),
        sanitizeCell(new Date(inq.createdAt).toISOString()),
        sanitizeCell(inq.name),
        sanitizeCell(inq.email),
        sanitizeCell(inq.phone || 'N/A'),
        sanitizeCell(inq.organization || 'N/A'),
        sanitizeCell(inq.service),
        sanitizeCell(inq.subject || 'Project Inquiry'),
        sanitizeCell(inq.message),
        sanitizeCell(inq.adminNotes || ''),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="anthix-inquiries-${Date.now()}.csv"`
      );

      res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------------------------
  // Demo Management (Admin to User Demo Sharing)
  // ----------------------------------------------------------------------

  /**
   * GET /api/admin/demos
   * Lists all demos with pagination, search, status filter, and recipient details
   */
  public static getDemos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
      const search = (req.query.search as string || '').trim();
      const status = (req.query.status as string || '').trim();
      const userId = (req.query.userId as string || '').trim();

      const filter: any = {};

      if (status && (status === 'draft' || status === 'published')) {
        filter.status = status;
      }

      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        filter.recipientUserId = userId;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [demos, total] = await Promise.all([
        Demo.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('recipientUserId', 'name email role company profileImage')
          .populate('createdByAdminId', 'name email')
          .select('-__v')
          .lean()
          .exec(),
        Demo.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      sendSuccess(res, 'Demos retrieved successfully.', {
        demos,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/demos/:id
   * Retrieves single demo details including private admin notes and recipient user
   */
  public static getDemoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid demo ID format.', 400);
        return;
      }

      const demo = await Demo.findById(id)
        .populate('recipientUserId', 'name email role company phone profileImage')
        .populate('createdByAdminId', 'name email')
        .select('-__v')
        .exec();

      if (!demo) {
        sendError(res, 'Demo not found.', 404);
        return;
      }

      sendSuccess(res, 'Demo details retrieved.', { demo });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/admin/demos
   * Creates and shares a new project demo specifically targeted to a user
   */
  public static createDemo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        title,
        description,
        category,
        thumbnail,
        demoUrl,
        videoUrl,
        attachmentName,
        attachmentUrl,
        recipientUserId,
        status = 'published',
        adminMessage,
        privateAdminNotes,
        expiresAt,
      } = req.body;

      if (!title || !description || !demoUrl || !recipientUserId) {
        sendError(res, 'Demo title, description, demo URL, and recipient user are required.', 400);
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(recipientUserId)) {
        sendError(res, 'Invalid recipient user ID format.', 400);
        return;
      }

      // Explicit verification: check that intended recipient exists
      const recipient = await User.findById(recipientUserId).exec();
      if (!recipient) {
        sendError(res, 'Selected recipient user was not found.', 404);
        return;
      }

      const demo = await Demo.create({
        title: title.trim(),
        description: description.trim(),
        category: (category || 'Custom Solution').trim(),
        thumbnail: (thumbnail || '').trim(),
        demoUrl: demoUrl.trim(),
        videoUrl: (videoUrl || '').trim(),
        attachmentName: (attachmentName || '').trim(),
        attachmentUrl: (attachmentUrl || '').trim(),
        recipientUserId,
        status: status === 'draft' ? 'draft' : 'published',
        adminMessage: (adminMessage || '').trim(),
        privateAdminNotes: (privateAdminNotes || '').trim(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdByAdminId: req.user!.id,
      });

      // If published, trigger in-app notification & optional email to user
      if (demo.status === 'published') {
        await Notification.create({
          recipientUserId: recipient._id,
          type: 'demo_shared',
          title: `Project Demo Shared: ${demo.title}`,
          message:
            demo.adminMessage ||
            `A custom project demo "${demo.title}" has been published to your dashboard.`,
          relatedDemoId: demo._id,
          link: '/dashboard/demos',
        });

        // Send email alert to user if email service is active
        try {
          await EmailService.sendCustomEmail(
            recipient.email,
            recipient.name,
            `Interactive Demo Available: ${demo.title}`,
            `Hello ${recipient.name},\n\nAn interactive project demo "${demo.title}" has been published to your private ANTHIX Dashboard.\n\n${
              demo.adminMessage ? `Message from our team:\n"${demo.adminMessage}"\n\n` : ''
            }Log in to your dashboard to review and test the prototype:\n${env.CLIENT_URL || 'https://anthix.com'}/dashboard/demos\n\nBest regards,\nThe ANTHIX Team`
          );
        } catch (emailErr) {
          console.warn('[Demo Email Notification Warning]:', emailErr);
        }
      }

      console.log(`[Admin Action] Demo "${demo.title}" created for user: ${recipient.email} by ${req.user!.email}`);

      sendSuccess(res, 'Demo created and shared successfully.', { demo }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/demos/:id
   * Updates an existing demo
   */
  public static updateDemo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid demo ID format.', 400);
        return;
      }

      const demo = await Demo.findById(id).exec();
      if (!demo) {
        sendError(res, 'Demo not found.', 404);
        return;
      }

      const wasDraft = demo.status === 'draft';

      const allowedFields = [
        'title',
        'description',
        'category',
        'thumbnail',
        'demoUrl',
        'videoUrl',
        'attachmentName',
        'attachmentUrl',
        'status',
        'adminMessage',
        'privateAdminNotes',
        'expiresAt',
      ];

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          if (field === 'expiresAt') {
            demo.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : undefined;
          } else {
            (demo as any)[field] = req.body[field];
          }
        }
      }

      await demo.save();

      // If transition from draft to published, notify recipient
      if (wasDraft && demo.status === 'published') {
        await Notification.create({
          recipientUserId: demo.recipientUserId,
          type: 'demo_shared',
          title: `Project Demo Published: ${demo.title}`,
          message:
            demo.adminMessage ||
            `A project demo "${demo.title}" has been published to your dashboard.`,
          relatedDemoId: demo._id,
          link: '/dashboard/demos',
        });
      }

      sendSuccess(res, 'Demo updated successfully.', { demo });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/demos/:id/publish
   * Toggles publish state between draft and published
   */
  public static togglePublishDemo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid demo ID format.', 400);
        return;
      }

      const demo = await Demo.findById(id).exec();
      if (!demo) {
        sendError(res, 'Demo not found.', 404);
        return;
      }

      const nextStatus = demo.status === 'published' ? 'draft' : 'published';
      demo.status = nextStatus;
      await demo.save();

      if (nextStatus === 'published') {
        await Notification.create({
          recipientUserId: demo.recipientUserId,
          type: 'demo_shared',
          title: `Project Demo Published: ${demo.title}`,
          message: `Your project demo "${demo.title}" is now available to view.`,
          relatedDemoId: demo._id,
          link: '/dashboard/demos',
        });
      }

      sendSuccess(res, `Demo status changed to ${nextStatus}.`, { demo });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/admin/demos/:id
   * Permanently deletes a demo and its associated notifications
   */
  public static deleteDemo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendError(res, 'Invalid demo ID format.', 400);
        return;
      }

      const demo = await Demo.findByIdAndDelete(id).exec();
      if (!demo) {
        sendError(res, 'Demo not found.', 404);
        return;
      }

      // Cleanup associated notifications
      await Notification.deleteMany({ relatedDemoId: id });

      console.log(`[Admin Action] Demo permanently deleted: "${demo.title}" by ${req.user!.email}`);

      sendSuccess(res, 'Demo permanently deleted.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/users/search
   * Autocomplete endpoint to search registered users by name, email, or company
   */
  public static searchUsersForDemo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const q = String(req.query.q || '').trim();
      const filter: any = {};

      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { company: { $regex: q, $options: 'i' } },
        ];
      }

      const users = await User.find(filter)
        .select('name email role company profileImage')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
        .exec();

      sendSuccess(res, 'Users retrieved.', {
        users: users.map((u) => ({
          _id: u._id.toString(),
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          company: u.company || '',
          profileImage: u.profileImage || '',
        })),
      });
    } catch (error) {
      next(error);
    }
  };
}
