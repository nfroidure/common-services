/* Architecture Note #1: Services

Since the services in this module are very common, we
 provide a helper to import them all with a single
 line of code.

Their goal is to encapsulate unpredictible states and
 inputs/outputs of the software they are part of. They
 are primarily meant to be used with
 [`knifecycle`](https://github.com/nfroidure/knifecycle)
 but should be usable with any DI system or even rawly.
*/

import initCodeGenerator from './codeGenerator.js';
import initCounter from './counter.js';
import initDelay from './delay.js';
import initLock from './lock.js';
import initLog, { DEFAULT_LOG_ROUTING, DEFAULT_LOG_CONFIG } from './log.js';
import initTime from './time.js';
import initRandom from './random.js';
import initProcess from './process.js';
import type {
  CodeGeneratorService,
  CodeGeneratorServiceConfig,
} from './codeGenerator.js';
import type { CounterService, CounterServiceConfig } from './counter.js';
import type { DelayProvider, DelayService } from './delay.js';
import type { LockService, LockServiceConfig } from './lock.js';
import type {
  LogService,
  LogServiceConfig,
  LogTypes,
  LogFunction,
  Logger,
} from './log.js';
import type { TimeService } from './time.js';
import type { RandomService } from './random.js';
import type { ProcessServiceConfig } from './process.js';

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
export type {
  CodeGeneratorServiceConfig,
  CodeGeneratorService,
  CounterServiceConfig,
  CounterService,
  DelayProvider,
  DelayService,
  LockServiceConfig,
  LockService,
  LogService,
  LogServiceConfig,
  LogTypes,
  LogFunction,
  Logger,
  TimeService,
  RandomService,
  ProcessServiceConfig,
};
export {
  initCodeGenerator as initCodeGeneratorService,
  initCounter as initCounterService,
  initDelay as initDelayService,
  initLock as initLockService,
  initLog as initLogService,
  DEFAULT_LOG_CONFIG,
  DEFAULT_LOG_ROUTING,
  initTime as initTimeService,
  initRandom as initRandomService,
  initProcess as initProcessService,
};
