import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { User, UserRole } from '../models/User';
import { env } from '../config/env';
import { sendError } from '../utils/apiResponse';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware ensuring the client has a valid authenticated session
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from Authorization Bearer header, HttpOnly cookie, or query parameter
    let token: string | undefined;

    if (req.headers.authorization) {
      const authHeader = req.headers.authorization.trim();
      const match = authHeader.match(/^bearer\s+(.+)$/i);
      if (match && match[1]) {
        token = match[1].trim();
      }
    }

    if (!token && req.cookies?.[env.COOKIE_NAME]) {
      token = req.cookies[env.COOKIE_NAME];
    }

    if (!token && typeof req.query?.token === 'string') {
      token = req.query.token.trim();
    }

    if (!token) {
      sendError(res, 'Authentication required. Please register or log in to contact ANTHIX.', 401);
      return;
    }

    // 2. Verify token signature
    const payload = AuthService.verifyToken(token);
    if (!payload) {
      AuthService.clearAuthCookie(res);
      sendError(res, 'Session expired or invalid. Please log in again.', 401);
      return;
    }

    const userId = payload.userId || (payload as any).id;
    if (!userId) {
      AuthService.clearAuthCookie(res);
      sendError(res, 'Session expired or invalid. Please log in again.', 401);
      return;
    }

    // 3. Confirm user still exists and account is active
    const user = await User.findById(userId).exec();
    if (!user || user.accountStatus !== 'active') {
      AuthService.clearAuthCookie(res);
      sendError(res, 'User account is inactive or not found.', 401);
      return;
    }

    // 4. Attach authenticated user details to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    };

    next();
  } catch (error) {
    console.error('[Authentication Middleware Error]:', error);
    sendError(res, 'Authentication check failed.', 500);
  }
};

/**
 * Middleware strictly enforcing administrator role
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    // Check current live database role to prevent stale role claims
    const user = await User.findById(req.user.id).select('role accountStatus').exec();
    if (!user || user.accountStatus !== 'active') {
      sendError(res, 'User account is inactive or not found.', 401);
      return;
    }

    if (user.role !== 'admin') {
      sendError(res, 'Access denied. Administrator privileges required.', 403);
      return;
    }

    next();
  } catch (error) {
    console.error('[requireAdmin Middleware Error]:', error);
    sendError(res, 'Admin authorization check failed.', 500);
  }
};
