'use strict';

const { initializer } = require('knifecycle/dist');

/* Architecture Note #1.1: Logging

I prefer using a unique function with the log type
 in parameter instead of several methods for each
 log types. It is far easyer to mock and to assert
 on logs in my tests.

If provided, I route debug messages to the `debug`
 node module.

*/

module.exports = initializer({
  name: 'log',
  type: 'service',
  inject: ['?logger', '?debug'],
  options: { singleton: true },
}, initLogService);

/**
 * Instantiate the logging service
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.logger=console]   The logger to use
 * @param  {Function} [services.debug]              A debugging function
 * @return {Promise<Function>}           A promise of the logging function
 * @example
 * import initLogService from 'common-services/src/log';
 *
 * const log = await initLogService({ debug: require('debug')('myapp') });
 */
function initLogService({ logger = console, debug }) {

  log('debug', 'Logging service initialized.');

  return Promise.resolve(log);

  /**
   * Logging function
   * @param  {String}  type   Log type
   * @param  {...*}       args   Log contents
   * @return {void}
   * @example
   * log('debug', 'Luke, I am your father!')
   */
  function log(type, ...args) {
    if(debug && ('debug' === type || 'stack' === type)) {
      debug(...args);
      return;
    }
    logger[type](...args);
  }
}
