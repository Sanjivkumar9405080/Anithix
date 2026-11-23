import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';
import adminRoutes from './routes/adminRoutes';
import projectRoutes from './routes/projectRoutes';
import { generalRateLimiter } from './middleware/rateLimiter';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/db';

const app: Application = express();

// Enable reverse proxy trust (required for Vercel, rate limiters, secure cookies, and accurate IP resolution)
app.set('trust proxy', 1);

// 1. Security Headers with Helmet (configured for cross-origin APIs)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Cookie Parser
app.use(cookieParser());

// 3. CORS Configuration
const configuredOrigins = [
  ...env.CLIENT_URL.split(',').map((o) => o.trim().replace(/\/$/, '')),
  ...env.FRONTEND_URL.split(',').map((o) => o.trim().replace(/\/$/, '')),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean);

const allowedOrigins = Array.from(new Set(configuredOrigins));

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow server-to-server, mobile apps, curl, or tools with no origin header
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');

    // 2. Check against explicit allowed list
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // 3. Allow all Netlify deployments (production, branch deploys, deploy previews)
    if (
      normalizedOrigin.endsWith('.netlify.app') ||
      /^https:\/\/([a-zA-Z0-9_-]+\.)*netlify\.app$/.test(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    // 4. Allow all Vercel deployments (production, branch deploys, preview domains)
    if (
      normalizedOrigin.endsWith('.vercel.app') ||
      /^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    // 5. In development/test environments, allow any localhost or 127.0.0.1 port
    if (env.NODE_ENV !== 'production') {
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
      if (isLocalhost) {
        return callback(null, true);
      }
    }

    // 6. Do not throw an unhandled Error object; pass false so CORS preflight fails gracefully
    console.warn(`[CORS Blocked] Origin "${origin}" is not in the allowed origins list.`);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 4. Request Body Parsers with payload size limit (supports profile avatars)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4b. Static Uploads Folder (Avatars & Assets)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 5. Database Connection Middleware (Guarantees DB is connected for serverless & traditional servers)
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Database Middleware Error]:', error);
    res.status(503).json({
      success: false,
      message: 'Database service is temporarily unavailable. Please try again shortly.',
    });
  }
});

// 6. Global API Rate Limiter
app.use('/api', generalRateLimiter);

// 6. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'ANTHIX Full Stack API Server',
    status: 'online',
    version: '2.0.0',
    documentation: '/api/health',
  });
});

// 7. 404 Handler
app.use(notFoundHandler);

// 8. Global Error Handler
app.use(errorHandler);

export default app;
