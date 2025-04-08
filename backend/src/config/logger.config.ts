import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: any;
}

const myFormat = printf(({ level, message, timestamp, ...metadata }: LogEntry) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        myFormat
      ),
    }),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

export class Logger {
  static info(message: string, metadata: Record<string, any> = {}) {
    logger.info(message, metadata);
  }

  static error(message: string, metadata: Record<string, any> = {}) {
    logger.error(message, metadata);
  }

  static warn(message: string, metadata: Record<string, any> = {}) {
    logger.warn(message, metadata);
  }

  static debug(message: string, metadata: Record<string, any> = {}) {
    logger.debug(message, metadata);
  }
} 