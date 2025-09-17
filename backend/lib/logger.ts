/**
 * Logger utility for development and production environments
 */

import { env } from '../config/env';

export class Logger {
  private static isDevelopment = env.NODE_ENV === 'development';

  static log(...args: any[]) {
    console.log(new Date().toISOString(), '[LOG]', ...args);
  }

  static error(...args: any[]) {
    console.error(new Date().toISOString(), '[ERROR]', ...args);
    // In production, you might want to send to a logging service
    // Example: sendToLoggingService('error', args)
  }

  static warn(...args: any[]) {
    console.warn(new Date().toISOString(), '[WARN]', ...args);
  }

  static info(...args: any[]) {
    console.info(new Date().toISOString(), '[INFO]', ...args);
  }

  static debug(...args: any[]) {
    if (this.isDevelopment) {
      console.debug(new Date().toISOString(), '[DEBUG]', ...args);
    }
  }
}

// Convenience exports
export const logger = Logger
export default Logger
