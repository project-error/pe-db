import { Logger } from '../logger/Logger';
import { container } from 'tsyringe';
import { Profiler } from '../profiler/Profiler';
import { stripIndents } from 'common-tags';
import { Server } from '../Server';

export const registerCommands = (): void => {
  const profilerSingleton = container.resolve(Profiler);
  const loggerSingleton = container.resolve(Logger);

  RegisterCommand(
    'longestquery',
    (src: number, [resourceName]: [string | undefined]) => {
      const query = profilerSingleton.getLongestQuery(resourceName);

      const msgTemplate = stripIndents`
        [Longest Query]
        Invoked By Resource: ${query.invokingResource}
        Time in MS: ${query.timeMicroSeconds / 1e6}
        Query Statement: ${query.query}
      `;

      loggerSingleton.info(msgTemplate);
    },
    false
  );

  RegisterCommand(
    'shortestquery',
    (src: number, [resourceName]: [string | undefined]) => {
      const query = profilerSingleton.getShortestQuery(resourceName);

      const msgTemplate = stripIndents`
        [Shortest Query]
        Invoked By Resource: ${query.invokingResource}
        Time in MS: ${query.timeMicroSeconds / 1e6}
        Query Statement: ${query.query}
      `;

      loggerSingleton.info(msgTemplate);
    },
    false
  );

  RegisterCommand(
    'averagequerytime',
    (src: number, [resourceName]: [string | undefined]) => {
      const queryAverageMs = profilerSingleton.getQueryAverageMs(resourceName);
      const numQueries = resourceName
        ? profilerSingleton.getQueriesForResource(resourceName).length
        : profilerSingleton.profiles.length;

      const msgTemplate = stripIndents`
        [Average Query Time]
        Amount of Queries: ${numQueries}
        Time (ms): ${queryAverageMs}
      `;

      loggerSingleton.info(msgTemplate);
    },
    false
  );
};

const exp = global.exports;

export const registerTestCommands = (): void => {
  RegisterCommand(
    'testExec',
    () => {
      exp['pe-db'].exec('SELECT * FROM MOCK_DATA', {}, () => {
        GetResourceState('sessionmanager');
      });
    },
    false
  );

  RegisterCommand(
    'testGhMatti',
    () => {
      const startTime = process.hrtime.bigint();
      exp.ghmattimysql.execute('SELECT * FROM MOCK_DATA', [], () => {
        const endtime = process.hrtime.bigint();

        const timeMs = Number(endtime - startTime) / 1e6;
        console.log(`GHMatti | Query time: ${timeMs}ms`);
      });
    },
    false
  );
};
