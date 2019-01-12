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

import initLog from './log';
import initTime from './time';
import initRandom from './random';
import initDelay from './delay';
import initProcess from './process';
import initCounter from './counter';
import initCodeGenerator from './codeGenerator';
import initLock from './lock';

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
  initLog as initLogService,
  initTime as initTimeService,
  initRandom as initRandomService,
  initDelay as initDelayService,
  initProcess as initProcessService,
  initCounter as initCounterService,
  initCodeGenerator as initCodeGeneratorService,
  initLock as initLockService,
};
