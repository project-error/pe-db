import { container } from 'tsyringe';
import { Database } from '../database/Database';
import { ExportCallback } from '../types/ExportCallback';
import { QueryResponse } from '../database/database.types';

const exp = global.exports;

export const registerExports = (): void => {
  const database = container.resolve(Database);

  // eslint-disable-next-line @typescript-eslint/ban-types
  exp('exec', (query: string, values: [] | Object, cb: ExportCallback<QueryResponse>) => {
    const invokingResource = GetInvokingResource();
    database.exec(query, values, cb, invokingResource);
  });
};
