'use strict';

const { initializer } = require('knifecycle/dist');

function noop() {}

/* Architecture Note #1.3: Randomness

The random service is just proxying [`Math.random`
](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
 in a stubbable manner.
*/

module.exports = initializer({
  name: 'random',
  type: 'service',
  inject: ['?log'],
  options: { singleton: true },
}, initRandomService);

/**
 * Instantiate the random service
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log]     A logging function
 * @return {Promise<Function>}           A promise of the random function
 * @example
 * import initRandomService from 'common-services/src/random';
 *
 * const random = await initRandomService({
 *   log: console.log.bind(console),
 * });
 */
function initRandomService({ log = noop }) {

  log('debug', 'Random service initialized.');

  return Promise.resolve(random);

  /**
   * Returns a new random number
   * @return {number}   The random number
   * @example
   * random()
   * // Prints: 0.3141592653589793
   */
  function random() {
    const num = Math.random();

    log('debug', 'Created a random number:', num);

    return num;
  }
}
