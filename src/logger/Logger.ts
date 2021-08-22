import { delay, inject, injectable, singleton } from 'tsyringe';
import { Config } from '../config/Config';
import { LoggerLevels, PrintOptions } from './logger.types';
import { CfxConsoleColors, colorize } from '../utils/colors';

@injectable()
@singleton()
export class Logger {
  constructor(
    @inject(delay(() => Config))
    private readonly config: Config
  ) {
    this.moduleStart('logger');
  }

  private printConsole(msg: string, opts: PrintOptions): void {
    const colorizedMsg = colorize(msg, opts.color);

    console.log(colorizedMsg);
  }

  private writeToLog(msg: string, opts: PrintOptions): void {
    const level = opts.level;
    const taggedMsg = `[${LoggerLevels[level]}] ${msg}`;
    this.printConsole(taggedMsg, opts);
  }

  public error(msg: string): void {
    this.writeToLog(msg, {
      level: LoggerLevels.ERROR,
      color: CfxConsoleColors.Blue,
    });
  }

  public debug(msg: string): void {
    this.writeToLog(msg, {
      level: LoggerLevels.DEBUG,
      color: CfxConsoleColors.Blue,
    });
  }

  public warning(msg: string): void {
    this.writeToLog(msg, {
      level: LoggerLevels.WARNING,
      color: CfxConsoleColors.Yellow,
    });
  }

  public info(msg: string): void {
    this.writeToLog(msg, {
      level: LoggerLevels.INFO,
      color: CfxConsoleColors.Green,
    });
  }

  public moduleStart(module: string): void {
    this.debug(`Module "${module.toUpperCase()}" has instantiated`);
  }
}
