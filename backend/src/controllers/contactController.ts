import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Contact } from '../models/Contact';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class ContactController {
  /**
   * POST /api/contact
   * Submits a project inquiry linked to the authenticated user
   */
  public static submitContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Verify DB readiness
      if (mongoose.connection.readyState !== 1) {
        sendError(res, 'Database service is temporarily unavailable. Please try again shortly.', 503);
        return;
      }

      // 2. Ensure authentication
      if (!req.user) {
        sendError(res, 'Authentication required. Please log in to submit a contact inquiry.', 401);
        return;
      }

      // 3. Extract and normalize inquiry fields
      const {
        service,
        organization = '',
        phone = '',
        subject = 'Project Inquiry',
        message,
        name: customName,
        email: customEmail,
      } = req.body;

      const contactName = (customName || req.user.name).trim();
      const contactEmail = (customEmail || req.user.email).trim().toLowerCase();

      // 4. Save to Database linked to authenticated userId
      const inquiry = await Contact.create({
        userId: req.user.id,
        name: contactName,
        email: contactEmail,
        service: service.trim(),
        organization: organization.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      });

      console.log(`[Contact] Inquiry #${inquiry._id} saved for user: ${req.user.email} (${service})`);

      sendSuccess(
        res,
        'Your inquiry has been submitted successfully. An ANTHIX engineer will review your project details shortly.',
        {
          id: inquiry._id,
          service: inquiry.service,
          createdAt: inquiry.createdAt,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/contact/me
   * Retrieves submissions belonging strictly to the authenticated user
   */
  public static getMyContacts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const contacts = await Contact.find({ userId: req.user.id, archived: { $ne: true } })
        .sort({ createdAt: -1 })
        .select('-adminNotes -archived -__v')
        .exec();

      sendSuccess(res, 'Contact submissions retrieved.', { contacts });
    } catch (error) {
      next(error);
    }
  };
}
