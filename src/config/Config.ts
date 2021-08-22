import { ConvarEnums, ConvarItems, FoundConvarItem } from '../types/ConvarItems';
import { PEConstants } from '../utils/constants';
import { Logger } from '../logger/Logger';
import { delay, inject, injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class Config {
  public ConfigInfo = new Map<keyof typeof ConvarEnums | string, FoundConvarItem>();

  constructor(
    @inject(delay(() => Logger))
    private readonly logger: Logger
  ) {
    this.logger.moduleStart('config');
    this.collectInfo();
  }

  private collectInfo() {
    for (const key of Object.keys(ConvarItems)) {
      const convarItem = ConvarItems[key];
      const isConvarInt = convarItem.type === 'int';

      const convarVal = isConvarInt
        ? GetConvarInt(`${PEConstants.ResourceName}:${key}`, <number>convarItem.default)
        : GetConvar(`${PEConstants.ResourceName}:${key}`, <string>convarItem.default);

      const mapItem: FoundConvarItem = { ...convarItem, value: convarVal };

      this.ConfigInfo.set(key, mapItem);
    }
  }
}
