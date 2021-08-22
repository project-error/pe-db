import { injectable, singleton } from 'tsyringe';
import { Logger } from '../logger/Logger';
import { Config } from '../config/Config';
import { PEConstants } from '../utils/constants';
import { ConnectionString } from 'connection-string';
import winston from 'winston';
import path from 'path';

const manualColorize = (strToColor: string): string => `[^2(${strToColor}\x1b^0`;

const formatLogs = (log: winston.Logform.TransformableInfo): string => {
  if (log.module)
    return `${log.label} ${manualColorize(log.module)} [${log.level}]: ${log.message}`;

  return `${log.label} ${manualColorize(`[${log.level}]: ${log.message}`)}`;
};

const findLogPath = () =>
  `${path.join(GetResourcePath(GetCurrentResourceName()), 'pe_db.log')}`;

// Initiate the main logger for NPWD

export const mainLogger = winston.createLogger({
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

@injectable()
@singleton()
export class Database {
  constructor(private readonly config: Config, private readonly logger: Logger) {
    this.logger.moduleStart('database');
    this.parseConnectionDetails();
  }

  private parseConnectionDetails(): void {
    let connection = <string>this.config.ConfigInfo.get('Connection')?.value;
    // Use default connection of localhost if this isn't set
    if (!connection) {
      connection = PEConstants.DefaultConnection;
    }

    const parsedConnection = new ConnectionString(connection);
    mainLogger.info({ ye: 'ye' });
  }

  public attemptInitialConnect(): void {}
}
