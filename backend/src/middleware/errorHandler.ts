import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation error occurred.', 400, formatted);
    return;
  }

  // 2. SyntaxError (e.g. malformed JSON body)
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    sendError(res, 'Malformed JSON payload provided.', 400);
    return;
  }

  // 3. Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const formatted = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 'Database validation error.', 400, formatted);
    return;
  }

  // 4. Mongoose Duplicate Key Error (11000)
  if (err && err.code === 11000) {
    const duplicateKey = Object.keys(err.keyPattern || {})[0] || 'field';
    sendError(res, `A record with this ${duplicateKey} already exists.`, 409);
    return;
  }

  // 5. Database connection unavailable
  if (
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoTimeoutError'
  ) {
    console.error('[Error: Database Connection]', err.message);
    sendError(res, 'Database service is temporarily unavailable. Please try again shortly.', 503);
    return;
  }

  // 6. Generic Internal Server Error
  const statusCode = err.statusCode || 500;
  const isDev = env.NODE_ENV === 'development';

  console.error('[Unhandled Server Error]:', err);

  const message =
    err.message && statusCode < 500
      ? err.message
      : 'An unexpected internal server error occurred. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};
