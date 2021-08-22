import { injectable, singleton } from 'tsyringe';
import { Config } from '../config/Config';
import { Logger } from '../logger/Logger';
import { ProfilerConfig, QueryProfile } from './Profiler.types';

@injectable()
@singleton()
export class Profiler {
  private profilerConfig: ProfilerConfig;
  public profiles: QueryProfile[] = [];

  public constructor(private readonly config: Config, private readonly logger: Logger) {
    this.logger.moduleStart('Profiler');

    this.profilerConfig = this.setupConfig();
  }

  private setupConfig(): ProfilerConfig {
    return {
      profilerEnabled: !!this.config.ConfigInfo.get('ProfilerEnabled')?.value,
    };
  }

  private logNewProfile({
    timeMicroSeconds,
    query,
    invokingResource,
  }: QueryProfile): void {
    const shouldLogOut = this.config.ConfigInfo.get('ProfilerLog')!.value;
    if (!shouldLogOut) return;

    const queryTimeMs = timeMicroSeconds / 1e6;

    const msgTemplate = `[${invokingResource}] ${queryTimeMs}ms | ${query} `;

    this.logger.info(msgTemplate);
  }

  public getQueriesForResource(resourceName: string): QueryProfile[] {
    return this.profiles.filter((query) => query.invokingResource === resourceName);
  }

  public getQueryAverageMs(resourceName?: string): number {
    const targetProfiles = resourceName
      ? this.profiles.filter((item) => item.invokingResource === resourceName)
      : this.profiles;

    // Convert to array of ms times
    const transformProfiles = targetProfiles.map((item) => item.timeMicroSeconds / 1e6);

    const sumQueryTime = transformProfiles.reduce((a, b) => a + b, 0);

    return sumQueryTime / targetProfiles.length;
  }

  public getLongestQuery(resourceName?: string): QueryProfile {
    const targetProfiles = resourceName
      ? this.profiles.filter((item) => item.invokingResource === resourceName)
      : this.profiles;

    return targetProfiles.sort((a, b) => a.timeMicroSeconds - b.timeMicroSeconds)[0];
  }

  public getShortestQuery(resourceName?: string): QueryProfile {
    const targetProfiles = resourceName
      ? this.profiles.filter((item) => item.invokingResource === resourceName)
      : this.profiles;

    return targetProfiles.sort((a, b) => b.timeMicroSeconds - a.timeMicroSeconds)[0];
  }

  /**
   * @param times [start, end]
   * @param query Associated query string
   * @param resource Invoking resource
   */
  public addQueryProfile(times: [bigint, bigint], query: string, resource: string): void {
    const totalTime = Number(times[1] - times[0]);

    const profileObj: QueryProfile = {
      query,
      invokingResource: resource,
      timeMicroSeconds: totalTime,
    };

    this.profiles.push(profileObj);
    this.logNewProfile(profileObj);
  }
}
