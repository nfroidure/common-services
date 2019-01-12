import { autoService, options } from 'knifecycle';

function noop() {}

/* Architecture Note #1.3: Randomness

The random service is just proxying [`Math.random`
](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
 in a stubbable manner.
*/

export default options({ singleton: true }, autoService(initRandom));

/**
 * Instantiate the random service
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the random function
 * @example
 * import initRandom from 'common-services/dist/random';
 *
 * const random = await initRandom({
 *   log: console.log.bind(console),
 * });
 */
async function initRandom({ log = noop }) {
  log('debug', 'Random service initialized.');

  return random;

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
