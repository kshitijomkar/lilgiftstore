/**
 * Centralized logging service for the application
 * Provides structured logging with different severity levels
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  info(message: string, data?: any) {
    const entry = this.formatLog('info', message, data);
    console.log(`[${entry.timestamp}] [INFO] ${message}`, data ? data : '');
  }

  warn(message: string, data?: any) {
    const entry = this.formatLog('warn', message, data);
    console.warn(`[${entry.timestamp}] [WARN] ${message}`, data ? data : '');
  }

  error(message: string, error?: any) {
    const entry = this.formatLog('error', message);
    if (error instanceof Error) {
      entry.stack = error.stack;
      console.error(`[${entry.timestamp}] [ERROR] ${message}`, error.message, error.stack);
    } else {
      console.error(`[${entry.timestamp}] [ERROR] ${message}`, error ? error : '');
    }
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      const entry = this.formatLog('debug', message, data);
      console.log(`[${entry.timestamp}] [DEBUG] ${message}`, data ? data : '');
    }
  }
}

export const logger = new Logger();
