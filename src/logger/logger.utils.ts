import { CfxConsoleColors, colorize } from '../utils/colors';

export const colorizeWithLevel = (str: string, level: string): string => {
  let color: CfxConsoleColors;

  switch (level) {
    case 'debug':
      color = CfxConsoleColors.Green;
      break;
    case 'error':
      color = CfxConsoleColors.Red;
      break;
    case 'info':
      color = CfxConsoleColors.Blue;
      break;
    case 'warn':
      color = CfxConsoleColors.Yellow;
      break;
    default:
      color = CfxConsoleColors.White;
  }

  return colorize(str, color);
};
