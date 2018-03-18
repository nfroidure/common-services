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

import initLogService from './log';
import initTimeService from './time';
import initRandomService from './random';
import initDelayService from './delay';
import initProcessService from './process';
import initCounterService from './counter';

/**
 * All services of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import * as COMMON_SERVICES from 'common-services';
 * import $ from 'knifecycle/instance';
 *
 * $.register(
 *   ...Object.keys(COMMON_SERVICES)
 *   .map(serviceName => COMMON_SERVICES[serviceName])
 *  );
 */
export {
  initLogService,
  initTimeService,
  initRandomService,
  initDelayService,
  initProcessService,
  initCounterService,
};
