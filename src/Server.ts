import { injectable, singleton } from 'tsyringe';
import { Logger } from './logger/Logger';
import { Database } from './database/Database';

@injectable()
@singleton()
export class Server {
  constructor(public readonly logger: Logger, public readonly database: Database) {
    this.logger.moduleStart('server');
  }

  public async start(): Promise<void> {
    try {
      await this.database.attemptInitialConnect();
      this.logger.info('Initial Setup Sucessful!');
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
