import initLogMock from './log.mock';
import initTimeMock from './time.mock';
import initRandomMock from './random.mock';
import initDelayMock from './delay.mock';
import initProcessMock from './process.mock';

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
