import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { env } from '../config/env';
import { IUser, SafeUser } from '../models/User';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export class AuthService {
  /**
   * Hashes a password using bcrypt
   */
  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares password with hash
   */
  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a signed JWT session token
   */
  public static generateToken(user: IUser | { _id: any; email: string; name: string; role?: 'user' | 'admin' }): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: (user as any).role || 'user',
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  /**
   * Verifies a JWT token
   */
  public static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Sets the HttpOnly session cookie
   */
  public static setAuthCookie(res: Response, token: string): void {
    const isProd = env.NODE_ENV === 'production';
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    res.cookie(env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: sevenDaysMs,
      path: '/',
    });
  }

  /**
   * Clears the session cookie on logout
   */
  public static clearAuthCookie(res: Response): void {
    const isProd = env.NODE_ENV === 'production';

    res.clearCookie(env.COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
  }

  /**
   * Sanitizes user model into safe representation
   */
  public static sanitizeUser(user: IUser): SafeUser {
    return user.toSafeObject();
  }
}
