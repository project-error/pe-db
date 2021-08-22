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
}

export const ConvarItems: IConvarItems = {
  [ConvarEnums.Connection]: {
    type: 'string',
    default: '',
  },
  [ConvarEnums.DebugMode]: {
    type: 'int',
    default: 0,
  },
};
