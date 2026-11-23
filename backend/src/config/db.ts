import mongoose from 'mongoose';
import { env } from './env';

/**
 * Sanitizes MongoDB URI for safe console logging
 */
export const sanitizeMongoUri = (uri: string): string => {
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isSeeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isSeeded: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB with connection caching optimized for Vercel Serverless
 * and traditional long-running Node.js processes.
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  // 1. Return existing active connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. Return active connection promise if connecting
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const mongoUri = env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI / MONGO_URI is not set in environment variables.');
  }

  console.log(`[Database] Connecting to MongoDB: ${sanitizeMongoUri(mongoUri)}`);

  cached.promise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      bufferCommands: false,
    })
    .then(async (m) => {
      console.log('[Database] MongoDB Connected Successfully.');

      // Perform seeding once per process lifecycle
      if (!cached.isSeeded) {
        cached.isSeeded = true;
        try {
          const { seedInitialProjects } = await import('./seedProjects');
          await seedInitialProjects();

          const { seedInitialAdmin } = await import('./seedAdmin');
          await seedInitialAdmin();
        } catch (seedErr) {
          console.warn('[Database Seed Warning]:', seedErr);
        }
      }

      return m;
    })
    .catch((err) => {
      cached.promise = null;
      console.error('[Database Connection Error]:', err);
      throw err;
    });

  cached.conn = await cached.promise;
  return cached.conn;
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database Error Event]:', err);
});

/**
 * Returns database health details
 */
export const getDBStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    readyState: stateCode,
    connected: stateCode === 1,
  };
};

/**
 * Disconnects gracefully
 */
export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected gracefully.');
  }
};
