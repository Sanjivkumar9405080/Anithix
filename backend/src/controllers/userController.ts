import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Contact } from '../models/Contact';
import { Demo } from '../models/Demo';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/apiResponse';
import {
  validateImageMagicBytes,
  saveAvatarFile,
  deleteAvatarFile,
} from '../services/avatarService';

export class UserController {
  /**
   * GET /api/users/me (and /api/users/profile)
   * Retrieves profile details and dashboard summary counters for the authenticated user
   */
  public static getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const user = await User.findById(req.user.id).exec();
      if (!user) {
        sendError(res, 'User record not found', 404);
        return;
      }

      // Compute live user stats for the dashboard overview
      const [totalRequests, inProgressRequests, totalDemos, unreadNotifications] =
        await Promise.all([
          Contact.countDocuments({
            $or: [{ userId: user._id }, { email: user.email.toLowerCase() }],
            archived: { $ne: true },
          }),
          Contact.countDocuments({
            $or: [{ userId: user._id }, { email: user.email.toLowerCase() }],
            status: { $in: ['new', 'in_progress'] },
            archived: { $ne: true },
          }),
          Demo.countDocuments({
            recipientUserId: user._id,
            status: 'published',
          }),
          Notification.countDocuments({
            recipientUserId: user._id,
            readAt: null,
          }),
        ]);

      sendSuccess(res, 'User profile retrieved successfully', {
        user: user.toSafeObject(),
        stats: {
          totalRequests,
          inProgressRequests,
          totalDemos,
          unreadNotifications,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/users/me
   * Allows the authenticated user to update their own profile details
   */
  public static updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const user = await User.findById(req.user.id).exec();
      if (!user) {
        sendError(res, 'User record not found', 404);
        return;
      }

      const {
        name,
        phone,
        company,
        jobTitle,
        organizationType,
        location,
        website,
        bio,
        interests,
      } = req.body;

      // 1. Validate full name if provided
      if (name !== undefined) {
        const cleanName = String(name).trim();
        if (cleanName.length < 2) {
          sendError(res, 'Full name must be at least 2 characters long.', 400);
          return;
        }
        if (cleanName.length > 100) {
          sendError(res, 'Full name cannot exceed 100 characters.', 400);
          return;
        }
        user.name = cleanName;
      }

      // 2. Validate phone number
      if (phone !== undefined) {
        user.phone = String(phone).trim().slice(0, 30);
      }

      // 3. Organization fields
      if (company !== undefined) {
        user.company = String(company).trim().slice(0, 100);
      }
      if (jobTitle !== undefined) {
        user.jobTitle = String(jobTitle).trim().slice(0, 100);
      }
      if (organizationType !== undefined) {
        const validTypes = ['', 'Business', 'School', 'College', 'Hospital', 'Agency', 'Startup', 'Other'];
        if (validTypes.includes(organizationType)) {
          user.organizationType = organizationType;
        }
      }

      // 4. Location & bio
      if (location !== undefined) {
        user.location = String(location).trim().slice(0, 100);
      }
      if (bio !== undefined) {
        user.bio = String(bio).trim().slice(0, 1000);
      }

      // 5. Website URL validation
      if (website !== undefined) {
        const cleanWebsite = String(website).trim();
        if (cleanWebsite) {
          if (!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(cleanWebsite)) {
            sendError(res, 'Please enter a valid website URL (starting with http:// or https://).', 400);
            return;
          }
          user.website = cleanWebsite.slice(0, 250);
        } else {
          user.website = '';
        }
      }

      // 6. Areas of interest
      if (Array.isArray(interests)) {
        user.interests = interests
          .map((i) => String(i).trim())
          .filter((i) => i.length > 0)
          .slice(0, 15);
      }

      await user.save();

      sendSuccess(res, 'Profile updated successfully', {
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/users/me/avatar
   * Uploads and validates an avatar image file (via base64 payload),
   * verifying magic bytes to reject spoofed extensions, saving to disk,
   * and updating the user's profile image URL.
   */
  public static uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        sendError(res, 'Image payload is required in base64 format.', 400);
        return;
      }

      // Extract raw base64 data (handling data:image/...;base64, prefix)
      const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      const rawBase64 = matches ? matches[2] : image;

      const buffer = Buffer.from(rawBase64, 'base64');

      // Maximum 3 MB allowed
      const MAX_SIZE_BYTES = 3 * 1024 * 1024;
      if (buffer.length > MAX_SIZE_BYTES) {
        sendError(res, 'Image file size exceeds the 3MB limit. Please upload a smaller image.', 400);
        return;
      }

      // Validate genuine image magic bytes (PNG, JPEG, WebP, GIF)
      const validation = validateImageMagicBytes(buffer);
      if (!validation.valid || !validation.ext) {
        sendError(res, validation.error || 'Invalid or corrupted image file.', 400);
        return;
      }

      const user = await User.findById(req.user.id).exec();
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      // Remove existing avatar file if previously uploaded
      deleteAvatarFile(user.profileImage);

      // Save new file to disk (or Cloudinary / Data URI on serverless)
      const avatarUrl = await saveAvatarFile(user.id, buffer, validation.ext);

      user.profileImage = avatarUrl;
      await user.save();

      sendSuccess(res, 'Profile photo updated successfully', {
        avatarUrl,
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/users/me/avatar
   * Removes the user's custom profile photo and restores default avatar
   */
  public static removeAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const user = await User.findById(req.user.id).exec();
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      if (user.profileImage) {
        deleteAvatarFile(user.profileImage);
        user.profileImage = '';
        await user.save();
      }

      sendSuccess(res, 'Profile photo removed successfully', {
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/me/requests
   * Retrieves all contact inquiries submitted by the authenticated user
   */
  public static getUserRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const requests = await Contact.find({
        $or: [{ userId: req.user.id }, { email: req.user.email.toLowerCase() }],
        archived: { $ne: true },
      })
        .select('-adminNotes -archived -__v') // Strictly omit internal admin notes
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      sendSuccess(res, 'User requests retrieved successfully', {
        requests,
        total: requests.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/me/requests/:id
   * Retrieves a single contact inquiry belonging to the authenticated user
   */
  public static getUserRequestById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const request = await Contact.findOne({
        _id: req.params.id,
        $or: [{ userId: req.user.id }, { email: req.user.email.toLowerCase() }],
        archived: { $ne: true },
      })
        .select('-adminNotes -archived -__v')
        .lean()
        .exec();

      if (!request) {
        sendError(res, 'Inquiry request not found.', 404);
        return;
      }

      sendSuccess(res, 'Inquiry request details retrieved', { request });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/me/demos
   * Retrieves all published project demos specifically shared with the authenticated user
   */
  public static getUserDemos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const demos = await Demo.find({
        recipientUserId: req.user.id,
        status: 'published',
      })
        .sort({ createdAt: -1 })
        .exec();

      // Format with toUserObject (omits privateAdminNotes, disables links if expired)
      const sanitizedDemos = demos.map((d) => d.toUserObject());

      sendSuccess(res, 'User demos retrieved successfully', {
        demos: sanitizedDemos,
        total: sanitizedDemos.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/me/demos/:id
   * Retrieves a single published demo shared with the authenticated user and marks viewed
   */
  public static getUserDemoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const demo = await Demo.findOne({
        _id: req.params.id,
        recipientUserId: req.user.id,
        status: 'published',
      }).exec();

      if (!demo) {
        sendError(res, 'Demo not found or access denied.', 404);
        return;
      }

      // Mark demo as viewed if first time
      if (!demo.viewedByUserAt) {
        demo.viewedByUserAt = new Date();
        await demo.save();
      }

      sendSuccess(res, 'Demo retrieved successfully', {
        demo: demo.toUserObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/me/notifications
   * Retrieves user notifications and unread counter
   */
  public static getUserNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const [notifications, unreadCount] = await Promise.all([
        Notification.find({ recipientUserId: req.user.id })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean()
          .exec(),
        Notification.countDocuments({
          recipientUserId: req.user.id,
          readAt: null,
        }),
      ]);

      sendSuccess(res, 'Notifications retrieved', {
        notifications,
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/users/me/notifications/:id/read
   * Marks a specific notification as read
   */
  public static markNotificationRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipientUserId: req.user.id },
        { readAt: new Date() },
        { new: true }
      ).exec();

      if (!notification) {
        sendError(res, 'Notification not found', 404);
        return;
      }

      sendSuccess(res, 'Notification marked as read', { notification });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/users/me/notifications/read-all
   * Marks all unread notifications for the user as read
   */
  public static markAllNotificationsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      await Notification.updateMany(
        { recipientUserId: req.user.id, readAt: null },
        { readAt: new Date() }
      ).exec();

      sendSuccess(res, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  };
}
