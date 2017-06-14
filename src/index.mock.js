'use strict';

const initLogMock = require('./log.mock');
const initTimeMock = require('./time.mock');
const initRandomMock = require('./random.mock');
const initDelayMock = require('./delay.mock');
const initProcessMock = require('./process.mock');

/**
 * All mocks of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import COMMON_MOCKS from 'common-services';
 * import $ from 'knifecycle/instance';
 *
 * $.register(
 *   ...Object.keys(COMMON_MOCKS)
 *   .map(serviceName => COMMON_MOCKS[serviceName])
 *  );
 */
const COMMON_MOCKS = {
  initLogMock,
  initTimeMock,
  initRandomMock,
  initDelayMock,
  initProcessMock,
};

module.exports = COMMON_MOCKS;
