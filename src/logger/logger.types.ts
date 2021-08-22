import { CfxConsoleColors } from '../utils/colors';

export enum LoggerLevels {
  INFO,
  ERROR,
  DEBUG,
  WARNING,
}

export interface PrintOptions {
  color: CfxConsoleColors;
  level: LoggerLevels;
}
