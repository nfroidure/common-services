'use strict';

const { initializer } = require('knifecycle/dist');
const DEFAULT_COUNTER = {
  log: false,
  firstCount: 1,
};

/* Architecture Note #1.6: Counter

The counter service provide a simple local and
 stubbable counter.

The count are returned asynchronously in order
 to be easily maintained across several instances
 if needed later.
*/

module.exports = initializer(
  {
    name: 'counter',
    type: 'service',
    inject: ['?log'],
    options: { singleton: true },
  },
  initCounterService,
);

/**
 * Instantiate the counter service
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.COUNTER]
 * An optional configuration object
 * @param  {Object}   [services.log]
 * An optional logging function
 * @return {Promise<Function>}
 * A promise of the counter function
 * @example
 * import initCounterService from 'common-services/src/counter';
 *
 * const counter = await initCounterService({
 *   COUNTER: { firstCount: 1 },
 *   log: console.log.bind(console),
 * });
 */
function initCounterService({ COUNTER = DEFAULT_COUNTER, log }) {
  let currentCount = COUNTER.firstCount || DEFAULT_COUNTER.firstCount;

  log('debug', 'Counter service initialized.');

  return Promise.resolve(counter);

  /**
   * Returns the current count and increment the counter
   * @return {Promise<number>}
   * A promise of the current count
   * @example
   * console.log([
   *   counter(),
   *   counter(),
   *   counter(),
   * ]);
   * // Prints: 1,2,3
   */
  function counter() {
    log('debug', 'Picked a count:', currentCount);
    return Promise.resolve(currentCount++);
  }
}
