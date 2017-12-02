'use strict';

const { initializer } = require('knifecycle/dist');

/* Architecture Note #1.2: Time

The time service is just proxying [`Date.now`
](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
 in a stubbable manner.
*/

module.exports = initializer(
  {
    name: 'time',
    type: 'service',
    inject: ['?log'],
    options: { singleton: true },
  },
  initTimeService
);

/**
 * Instantiate the time service
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log]     A logging function
 * @return {Promise<Function>}           A promise of the time function
 * @example
 * import initTimeService from 'common-services/src/time';
 *
 * const time = await initTimeService({
 *   log: console.log.bind(console),
 * });
 */
function initTimeService({ log }) {
  log('debug', 'Time service initialized.');

  return Promise.resolve(time);

  /**
   * Returns the current timestamp
   * @return {number}   The current timestamp
   * @example
   * time()
   * // Prints: 1326585600000
   */
  function time() {
    const now = Date.now();

    log('debug', 'Picked a timestamp:', now);
    return now;
  }
}
