import { createLogger, format, transports } from 'winston';
import { TransformableInfo } from 'logform';

const { combine, timestamp, printf } = format;

interface LogEntry extends TransformableInfo {
  timestamp: string;
  level: string;
  message: string;
}

const myFormat = printf((info: TransformableInfo) => {
  const { level, message, timestamp, ...metadata } = info as LogEntry;
  let msg = `${timestamp} [${level}] : ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        timestamp(),
        myFormat
      )
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp(),
        myFormat
      )
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp(),
        myFormat
      )
    })
  ]
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