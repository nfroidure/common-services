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

import initCodeGenerator from './services/codeGenerator.js';
import initCounter from './services/counter.js';
import initDelay from './services/delay.js';
import initLock from './services/lock.js';
import initLog, {
  DEFAULT_LOG_ROUTING,
  DEFAULT_LOG_CONFIG,
} from './services/log.js';
import initTime from './services/time.js';
import initRandom from './services/random.js';
import initResolve from './services/resolve.js';
import initImporter from './services/importer.js';

/**
 * All services of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import * as COMMON_SERVICES from 'common-services';
 * import { Knifecycle } from 'knifecycle';
 *
 * new Knifecycle().register(
 *   ...Object.keys(COMMON_SERVICES)
 *   .map(serviceName => COMMON_SERVICES[serviceName])
 * );
 */
export type {
  CodeGeneratorService,
  CodeGeneratorServiceConfig,
} from './services/codeGenerator.js';
export type {
  CounterService,
  CounterServiceConfig,
} from './services/counter.js';
export type { DelayProvider, DelayService } from './services/delay.js';
export type { LockService, LockServiceConfig } from './services/lock.js';
export type {
  LogService,
  LogServiceConfig,
  LogTypes,
  LogFunction,
  Logger,
} from './services/log.js';
export type { TimeService } from './services/time.js';
export type { RandomService } from './services/random.js';
export type { ResolveService } from './services/resolve.js';
export type { ImporterService } from './services/importer.js';
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
  initResolve as initResolveService,
  initImporter as initImporterService,
};
