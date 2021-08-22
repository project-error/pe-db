import { injectable, singleton } from 'tsyringe';
import { Logger } from '../logger/Logger';
import { Config } from '../config/Config';
import { Pool } from 'mysql2/promise';
import { generateConnectionPool } from './database.utils';
import { ExportCallback } from '../types/ExportCallback';
import { RowDataPacket } from 'mysql2';
import DatabaseError from '../structures/DatabaseError';
import { PossibleQueryResults } from '../types/QueryResult.types';
import { Profiler } from '../profiler/Profiler';

const RESOURCE_NAME = GetCurrentResourceName();

@injectable()
@singleton()
export class Database {
  private pool: Pool | null = null;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly profiler: Profiler
  ) {
    this.logger.moduleStart('database');

    this.exec = this.exec.bind(this);
  }

  public async attemptInitialConnect(): Promise<void> {
    const databaseConvar = this.config.ConfigInfo.get('Connection')!.value as string;

    this.pool = generateConnectionPool(databaseConvar);
  }

  private async _rawExec<T extends PossibleQueryResults>(
    query: string,
    values: any
  ): Promise<T | null> {
    if (!this.pool) throw new DatabaseError('Pool has not been setup!');

    ScheduleResourceTick(RESOURCE_NAME);
    const [res] = await this.pool.execute(query, values);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res;
  }

  public exec(
    queryTemplate: string,
    vals: unknown,
    cb: ExportCallback<RowDataPacket[]>,
    invokingResource: string
  ): void {
    const startTime = process.hrtime.bigint();

    this._rawExec<RowDataPacket[]>(queryTemplate, vals)
      .then((res) => {
        cb(res);
        const endTime = process.hrtime.bigint();

        this.profiler.addQueryProfile(
          [startTime, endTime],
          queryTemplate,
          invokingResource
        );
      })
      .catch((e) => {
        this.logger.error(
          `[${invokingResource}] Query "${queryTemplate}" failed, Error: ${e.message}`
        );
      });
  }
}
