'use strict';

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

const initLogService = require('./log');
const initTimeService = require('./time');
const initRandomService = require('./random');
const initDelayService = require('./delay');
const initProcessService = require('./process');
const initCounterService = require('./counter');

/**
 * All services of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import COMMON_SERVICES from 'common-services';
 * import $ from 'knifecycle/instance';
 *
 * $.register(
 *   ...Object.keys(COMMON_SERVICES)
 *   .map(serviceName => COMMON_SERVICES[serviceName])
 *  );
 */
const COMMON_SERVICES = {
  initLogService,
  initTimeService,
  initRandomService,
  initDelayService,
  initProcessService,
  initCounterService,
};

module.exports = COMMON_SERVICES;
