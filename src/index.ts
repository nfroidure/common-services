/* Architecture Note #1: Services

Since the services in this module are very common, we
 provide a helper to require them all with a single
 line of code.

Their goal is to encapsulate unpredictible states and
 inputs/outputs of the software they are part of. They
 are primarily meant to be used with
 [`knifecycle`](https://github.com/nfroidure/knifecycle)
 but should be usable with any DI system or even rawly.
*/

import initCodeGenerator, {
  CodeGeneratorService,
  CodeGeneratorServiceConfig,
} from './codeGenerator';
import initCounter, { CounterService, CounterServiceConfig } from './counter';
import initDelay, { DelayProvider, DelayService } from './delay';
import initLock, { LockService, LockServiceConfig } from './lock';
import initLog, {
  LogService,
  StdStream,
  DEFAULT_LOGGER,
  DEFAULT_LOG_ROUTING,
} from './log';
import initTime, { TimeService } from './time';
import initRandom, { RandomService } from './random';
import initProcess, { ProcessServiceConfig } from './process';

/**
 * All services of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import * as COMMON_SERVICES from 'common-services';
 * import Knifecycle from 'knifecycle';
 *
 * new Knifecycle().register(
 *   ...Object.keys(COMMON_SERVICES)
 *   .map(serviceName => COMMON_SERVICES[serviceName])
 * );
 */
export {
  initCodeGenerator as initCodeGeneratorService,
  CodeGeneratorServiceConfig,
  CodeGeneratorService,
  initCounter as initCounterService,
  CounterServiceConfig,
  CounterService,
  initDelay as initDelayService,
  DelayProvider,
  DelayService,
  initLock as initLockService,
  LockServiceConfig,
  LockService,
  initLog as initLogService,
  LogService,
  StdStream,
  DEFAULT_LOGGER,
  DEFAULT_LOG_ROUTING,
  initTime as initTimeService,
  TimeService,
  initRandom as initRandomService,
  RandomService,
  ProcessServiceConfig,
  initProcess as initProcessService,
};
