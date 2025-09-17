import { Request, Response } from 'express';
import { prisma } from './prisma';
import { logger } from './logger';
import { env } from '../config/env';
import os from 'os';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: ServiceHealth;
    memory: ServiceHealth;
    disk: ServiceHealth;
  };
  metrics: SystemMetrics;
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  lastChecked: string;
  details?: any;
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
  };
  disk: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
  };
  process: {
    pid: number;
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
  };
}

class HealthMonitor {
  private static instance: HealthMonitor;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'degraded' : 'unhealthy',
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          responseTime: `${responseTime}ms`,
          connectionPool: 'active'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: {
          error: 'Database not available',
          note: 'Running without database connection'
        }
      };
    }
  }

  checkMemory(): ServiceHealth {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercent = (usedMemory / totalMemory) * 100;

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (usagePercent > 90) status = 'unhealthy';
    else if (usagePercent > 80) status = 'degraded';

    return {
      status,
      lastChecked: new Date().toISOString(),
      details: {
        total: `${Math.round(totalMemory / 1024 / 1024 / 1024)}GB`,
        free: `${Math.round(freeMemory / 1024 / 1024 / 1024)}GB`,
        used: `${Math.round(usedMemory / 1024 / 1024 / 1024)}GB`,
        usagePercent: `${usagePercent.toFixed(2)}%`
      }
    };
  }

  checkDisk(): ServiceHealth {
    // Note: Bu Windows için basitleştirilmiş bir implementasyon
    // Production'da daha detaylı disk kontrolü yapılabilir
    try {
      const stats = process.memoryUsage();
      const heapUsed = stats.heapUsed;
      const heapTotal = stats.heapTotal;
      const usagePercent = (heapUsed / heapTotal) * 100;

      let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
      if (usagePercent > 90) status = 'unhealthy';
      else if (usagePercent > 80) status = 'degraded';

      return {
        status,
        lastChecked: new Date().toISOString(),
        details: {
          heapUsed: `${Math.round(heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(heapTotal / 1024 / 1024)}MB`,
          usagePercent: `${usagePercent.toFixed(2)}%`
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        details: { error: 'Failed to check disk status' }
      };
    }
  }

  getSystemMetrics(): SystemMetrics {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return {
      cpu: {
        usage: os.loadavg()[0] || 0,
        loadAverage: os.loadavg()
      },
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
        usagePercent: (usedMemory / totalMemory) * 100
      },
      disk: {
        total: 0, // Placeholder - would need platform-specific implementation
        free: 0,
        used: 0,
        usagePercent: 0
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }
    };
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const [databaseHealth, memoryHealth, diskHealth] = await Promise.all([
      this.checkDatabase(),
      Promise.resolve(this.checkMemory()),
      Promise.resolve(this.checkDisk())
    ]);

    const services = {
      database: databaseHealth,
      memory: memoryHealth,
      disk: diskHealth
    };

    // Overall status determination
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    const statuses = Object.values(services).map(s => s.status);
    
    if (statuses.includes('unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (statuses.includes('degraded')) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      environment: env.NODE_ENV,
      version: '1.0.0',
      services,
      metrics: this.getSystemMetrics()
    };
  }
}

// Export singleton instance
export const healthMonitor = HealthMonitor.getInstance();

// Health check middleware
export const healthCheckHandler = async (req: Request, res: Response) => {
  try {
    const health = await healthMonitor.getHealthStatus();
    
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 206 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};

// Readiness check (for Kubernetes/Docker)
export const readinessHandler = async (req: Request, res: Response) => {
  try {
    const dbHealth = await healthMonitor.checkDatabase();
    
    if (dbHealth.status === 'unhealthy') {
      return res.status(503).json({
        ready: false,
        reason: 'Database not available'
      });
    }
    
    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: 'Service not ready'
    });
  }
};

// Liveness check (for Kubernetes/Docker)
export const livenessHandler = (req: Request, res: Response) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};
