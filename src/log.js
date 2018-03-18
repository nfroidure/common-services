import { initializer } from 'knifecycle';

function noop() {}

// Fallbacking to silent logs making logging
// opt-in. It appears to be the best default
// since logs are easy to get but won't disturb
// tests.
const DEFAULT_LOGGER = {
  debug: noop, // eslint-disable-line
  error: noop, // eslint-disable-line
  info: noop, // eslint-disable-line
  warning: noop, // eslint-disable-line
};

/* Architecture Note #1.1: Logging

I prefer using a unique function with the log type
 in parameter instead of several methods for each
 log types. It is far easyer to mock and to assert
 on logs in my tests.

If provided, I route debug messages to the `debug`
 node module.

*/

export default initializer(
  {
    name: 'log',
    type: 'service',
    inject: ['?logger', '?debug'],
    options: { singleton: true },
  },
  initLogService,
);

/**
 * Instantiate the logging service
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.logger]
 * The logger to use
 * @param  {Function} [services.debug = noop]
 * A debugging function
 * @return {Promise<Function>}
 * A promise of the logging function
 * @example
 * import initLogService from 'common-services/src/log';
 *
 * const log = await initLogService({
 *   logger: require('winston'),
 *   debug: require('debug')('myapp'),
 *  });
 */
async function initLogService({ logger = DEFAULT_LOGGER, debug = noop }) {
  log('debug', 'Logging service initialized.');

  return log;

  /**
   * Logging function
   * @param  {String}  type
   * Log type
   * @param  {...*}    args
   * Log contents
   * @return {void}
   * @example
   * log('debug', 'Luke, I am your father!')
   */
  function log(type, ...args) {
    // The stack type allows to filter logs in testing
    // since the stack files paths vary between systems
    if (debug && ('debug' === type || 'stack' === type)) {
      debug(...args);
      return;
    }
    logger[logger[type] ? type : 'error'](...args);
  }
}
