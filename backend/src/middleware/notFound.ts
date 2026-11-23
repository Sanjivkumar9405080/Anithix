import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found on this server.`, 404);
};
