interface ConvarItem {
  type: 'int' | 'string';
  default: string | number;
}

export interface FoundConvarItem extends ConvarItem {
  value: string | number;
}

type IConvarItems = {
  [key: string]: ConvarItem;
};

export enum ConvarEnums {
  Connection = 'Connection',
  DebugMode = 'DebugMode',
  ProfilerEnabled = 'ProfilerOn',
  ProfilerLog = 'ProfilerLog',
}

export const ConvarItems: IConvarItems = {
  [ConvarEnums.Connection]: {
    type: 'string',
    default: 'mysql://localhost:3306/database',
  },
  [ConvarEnums.DebugMode]: {
    type: 'int',
    default: 0,
  },
  [ConvarEnums.ProfilerEnabled]: {
    type: 'int',
    default: 0,
  },
  [ConvarEnums.ProfilerLog]: {
    type: 'int',
    default: 0,
  },
};
