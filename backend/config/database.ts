import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;

// Database connection helper
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error: any) {
    console.warn('Database connection failed:', error?.message || 'Unknown error');
    return false;
  }
};

// Database disconnection helper
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};

// Health check
export const isDatabaseHealthy = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};
