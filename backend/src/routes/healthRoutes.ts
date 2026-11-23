import { Router, Request, Response } from 'express';
import { getDBStatus } from '../config/db';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbStatus = getDBStatus();

  res.status(200).json({
    status: dbStatus.connected ? 'ok' : 'degraded',
    service: 'ANTHIX Backend API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
  });
});

export default router;
