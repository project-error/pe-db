import { delay, inject, injectable } from 'tsyringe';
import { Config } from '../config/Config';
import { mainLogger } from './winston.logger';

@injectable()
export class Logger {
  private readonly winstonLogger = mainLogger;
  private moduleName = 'Unknown';

  constructor(
    @inject(delay(() => Config))
    private readonly config?: Config
  ) {}

  public setModuleName(name: string): void {
    this.moduleName = name;
  }

  public error(msg: any): void {
    this.winstonLogger.error(msg);
  }

  public debug(msg: any): void {
    this.winstonLogger.debug(msg);
  }

  public warning(msg: any): void {
    this.winstonLogger.warn(msg);
  }

  public info(msg: any): void {
    this.winstonLogger.info(msg);
  }

  public moduleStart(module: string): void {
    this.debug(`Module "${module.toUpperCase()}" has instantiated`);
  }
}
