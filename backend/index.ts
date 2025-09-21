// MUST BE FIRST: Load environment variables from .env file
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import { connectDatabase, isDatabaseHealthy } from './config/database';
import { prisma } from './lib/prisma';
import { healthCheckHandler, readinessHandler, livenessHandler } from './lib/monitoring';
import { 
  ipFilterMiddleware, 
  validateRequest, 
  securityHeaders, 
  securityLogger,
  requestSizeValidator 
} from './lib/security';
import { 
  errorHandler, 
  notFoundHandler, 
  requestIdMiddleware,
  handleUncaughtExceptions 
} from './lib/errors';

// Initialize Express app
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO with enhanced authentication support
const io = new SocketIOServer(server, {
  cors: {
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  cookie: {
    name: "io",
    httpOnly: true,
    sameSite: "lax"
  }
});

// Add cookie-parser middleware to Engine.IO for httpOnly cookie support
io.engine.use((req, res, next) => {
  const isHandshake = req._query.sid === undefined;
  if (isHandshake) {
    // Apply cookie parsing only for handshake requests
    cookieParser()(req, res, next);
  } else {
    next();
  }
});

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Early security middleware
app.use(requestIdMiddleware);
app.use(securityLogger);
app.use(ipFilterMiddleware);
app.use(requestSizeValidator());
app.use(securityHeaders);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request validation
app.use(validateRequest);

// Health check endpoints
app.get('/health', healthCheckHandler);
app.get('/health/ready', readinessHandler);
app.get('/health/live', livenessHandler);

// Legacy health endpoint for backward compatibility
app.get('/status', async (req, res) => {
  const dbHealthy = await isDatabaseHealthy();
  
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// Socket.IO authentication and admin events
import { adminAuthMiddleware, emitToAdmins, logAdminActivity, AuthenticatedSocket } from './lib/adminAuth';

// Admin WebSocket namespace with authentication
const adminNamespace = io.of('/admin');
adminNamespace.use(adminAuthMiddleware);

adminNamespace.on('connection', (socket) => {
  const authSocket = socket as AuthenticatedSocket;
  console.log(`🔗 Admin ${authSocket.user.username} connected to admin namespace`);
  
  // Join admin room for broadcasting
  authSocket.join('admins');
  
  // Send welcome message with user info
  authSocket.emit('admin:welcome', {
    user: authSocket.user,
    connectedAt: new Date().toISOString()
  });

  // Real-time stats request
  authSocket.on('admin:request_stats', async () => {
    try {
      const stats = await getAdminStats();
      authSocket.emit('admin:stats_update', stats);
    } catch (error) {
      authSocket.emit('admin:error', { message: 'Failed to fetch stats' });
    }
  });

  // User activity monitoring
  authSocket.on('admin:subscribe_user_activity', () => {
    authSocket.join('user_activity_subscribers');
    console.log(`Admin ${authSocket.user.username} subscribed to user activity`);
  });

  // Report monitoring
  authSocket.on('admin:subscribe_reports', () => {
    authSocket.join('report_subscribers');
    console.log(`Admin ${authSocket.user.username} subscribed to reports`);
  });

  // Handle disconnect
  authSocket.on('disconnect', () => {
    console.log(`🔌 Admin ${authSocket.user.username} disconnected`);
    logAdminActivity(authSocket.userId, 'DISCONNECT', {
      disconnectedAt: new Date().toISOString()
    });
  });

  // Log admin connection
  logAdminActivity(authSocket.userId, 'CONNECT', {
    connectedAt: new Date().toISOString(),
    userAgent: authSocket.handshake.headers['user-agent']
  });
});

// Helper function to get admin stats
const getAdminStats = async () => {
  const [userCount, lineupCount, crosshairCount, reportCount] = await Promise.all([
    prisma.user.count(),
    prisma.lineup.count(),
    prisma.crosshair.count(),
    prisma.report.count({ where: { status: 'PENDING' } })
  ]);

  return {
    totalUsers: userCount,
    totalLineups: lineupCount,
    totalCrosshairs: crosshairCount,
    pendingReports: reportCount,
    timestamp: new Date().toISOString()
  };
};

// Export socket instance for use in other modules
export { io, adminNamespace, emitToAdmins };

// API routes
import apiRouter from './api';
app.use('/api', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Handle uncaught exceptions
handleUncaughtExceptions();

// Start server
const startServer = async () => {
  try {
    // Try to connect to database (optional for development)
    console.log('🔌 Attempting database connection...');
    const dbConnected = await connectDatabase();
    if (!dbConnected) {
      console.warn('⚠️ Database connection failed - running without database');
      console.log('📝 Note: Some features may be limited without database');
    } else {
      console.log('✅ Database connected successfully');
    }
    
    // Start HTTP server with Socket.IO
    server.listen(env.PORT, () => {
      console.log(`🚀 Backend server running on port ${env.PORT}`);
      console.log(`📍 API available at: ${env.API_BASE_URL}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
      console.log(`🔌 WebSocket server ready for admin connections`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      
      // Close Socket.IO connections
      io.close(() => {
        console.log('WebSocket server closed.');
        
        server.close(() => {
          console.log('HTTP server closed.');
          process.exit(0);
        });
      });
      
      // Force close after 30 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
export { startServer };
