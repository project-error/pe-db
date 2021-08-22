export interface ProfilerConfig {
  profilerEnabled: boolean;
}

export interface QueryProfile {
  invokingResource: string;
  query: string;
  timeMicroSeconds: number;
}
