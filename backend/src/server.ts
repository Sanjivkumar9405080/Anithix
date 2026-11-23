import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';

const server = http.createServer(app);

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 ANTHIX API Server listening on port ${env.PORT}`);
    console.log(`🌐 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 Allowed Client Origin: ${env.CLIENT_URL}`);
    console.log(`🩺 Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`=================================================\n`);
  });
};

// Graceful Shutdown Logic
const handleShutdown = async (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    await disconnectDB();
    console.log('[Server] Graceful shutdown completed.');
    process.exit(0);
  });

  // Force shutdown if stuck after 10 seconds
  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
