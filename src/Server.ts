import { injectable, singleton } from 'tsyringe';
import { Logger } from './logger/Logger';
import { Database } from './database/Database';

@injectable()
@singleton()
export class Server {
  constructor(public readonly logger: Logger, public readonly database: Database) {
    this.logger.moduleStart('server');
  }

  public start(): void {
    console.log('Started');
  }
}
