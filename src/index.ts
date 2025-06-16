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

import initLRUPool from './services/lruPool.js';
import initCodeGenerator from './services/codeGenerator.js';
import initCounter from './services/counter.js';
import initDelay from './services/delay.js';
import initLock from './services/lock.js';
import initLog, {
  DEFAULT_LOG_ROUTING,
  DEFAULT_LOG_CONFIG,
} from './services/log.js';
import initLogger, { DEFAULT_LOGGER } from './services/logger.js';
import initTime from './services/time.js';
import initRandom from './services/random.js';
import initResolve from './services/resolve.js';
import initImporter from './services/importer.js';
import initPassword, { DEFAULT_PASSWORD_OPTIONS } from './services/password.js';
import initSymmetricEncryption, {
  DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME,
} from './services/symmetricEncryption.js';
import { noop } from './utils/utils.js';
import { randomBytes } from './utils/crypto.js';

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
export type * from './services/lruPool.js';
export type * from './services/codeGenerator.js';
export type * from './services/counter.js';
export type * from './services/delay.js';
export type * from './services/lock.js';
export type * from './services/log.js';
export type * from './services/time.js';
export type * from './services/random.js';
export type * from './services/resolve.js';
export type * from './services/importer.js';
export type * from './services/password.js';
export type * from './services/symmetricEncryption.js';
export {
  noop,
  randomBytes,
  initLRUPool,
  initCodeGenerator,
  initCounter,
  initDelay,
  initLock,
  initLog,
  DEFAULT_LOG_CONFIG,
  DEFAULT_LOG_ROUTING,
  initLogger,
  DEFAULT_LOGGER,
  initTime,
  initRandom,
  initResolve,
  initImporter,
  DEFAULT_PASSWORD_OPTIONS,
  initPassword,
  DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME,
  initSymmetricEncryption,
};
