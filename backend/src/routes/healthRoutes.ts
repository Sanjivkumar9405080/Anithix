import { Router, Request, Response } from 'express';
import { getDBStatus } from '../config/db';
import { env, isEmailConfigured } from '../config/env';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbStatus = getDBStatus();
  const emailConfigured = isEmailConfigured();

  res.status(200).json({
    status: dbStatus.connected ? 'ok' : 'degraded',
    service: 'ANTHIX Backend API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    email: {
      configured: emailConfigured,
      service: env.EMAIL_SERVICE || 'smtp',
      host: env.EMAIL_HOST || 'none',
      port: env.EMAIL_PORT,
      secure: env.EMAIL_SECURE,
      from: env.EMAIL_FROM,
    },
  });
});

export default router;
