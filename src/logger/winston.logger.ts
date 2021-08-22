import winston from 'winston';
import path from 'path';
import { colorizeWithLevel } from './logger.utils';

const formatLogs = (log: winston.Logform.TransformableInfo): string => {
  if (log.module)
    return `^5${log.label}^0 ${colorizeWithLevel(
      `[${log.level}] ${log.message}`,
      log.level
    )}`;

  return `^6${log.label}^0 ${colorizeWithLevel(
    `[${log.level}] ${log.message}`,
    log.level
  )}`;
};

const findLogPath = () =>
  `${path.join(GetResourcePath(GetCurrentResourceName()), 'logs', 'pe_db.log')}`;

export const mainLogger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.File({
      filename: findLogPath(),
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({ label: '[PE-DB]' }),
        winston.format.printf(formatLogs)
      ),
    }),
  ],
});
