export enum CfxConsoleColors {
  White = '^0',
  Red = '^1',
  Blue = '^4',
  Green = '^2',
  Yellow = '^3',
}

export const colorize = (str: string, color: CfxConsoleColors): string => {
  return color + str + CfxConsoleColors.White;
};
