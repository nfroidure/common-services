'use strict';

const YError = require('yerror');
const { initializer } = require('knifecycle/dist');

function noop() {}

/* Architecture Note #1.4: Delaying

The delay service is `setTimeout` like I would like it
 to be.
*/

module.exports = initializer({
  name: 'delay',
  type: 'provider',
  inject: ['?log'],
  options: { singleton: true },
}, initDelayService);

/**
 * Instantiate the delay service
 * @param  {Object}     services
 * The services to inject
 * @param  {Function}   [services.log]
 * A logging function
 * @return {Promise<Object>}
 * A promise of the delay service
 * @example
 * import initDelayService from 'common-services/src/delay';
 *
 * const delay = await initDelayService({
 *   log: console.log.bind(console)
 * });
 */
function initDelayService({ log = noop }) {
  const pendingPromises = new Map();

  log('debug', 'Delay service initialized.');

  return Promise.resolve({
    service: {
      create,
      clear,
    },
    dispose,
  });

  /**
   * Create a new delay
   * @param  {Number}   delay  The delay in ms
   * @return {Promise}
   * A promise to be resolved after that delay
   * or rejected if it is cancelled.
   * @example
   * delay.create(1000)
   * .then(() => console.log('1000 ms elapsed!'))
   * .catch(() => console.log('Cancelled!'));
   * // Prints: 1000 ms elapsed!
   */
  function create(delay) {
    let timeoutId;
    let _reject;
    const promise = new Promise((resolve, reject) => {
      _reject = reject;
      timeoutId = setTimeout(() => {
        resolve();
        pendingPromises.delete(promise);
      }, delay);
    });

    pendingPromises.set(promise, {
      timeoutId,
      reject: _reject,
    });
    log('debug', 'Created a delay:', delay);
    return promise;
  }

  /**
   * Cancel an earlier created delay
   * @param  {Promise}   promise
   * The promise of the delay to cancel
   * @return {Promise}
   * A promise resolved when cancellation is done.
   * @example
   * const delayed = delay.create(1000)
   * .then(() => console.log('1000 ms elapsed!'))
   * .catch(() => console.log('Cancelled!'));
   * clear(delayed)
   * // Prints: Cancelled!
   */
  function clear(promise) {
    if(!pendingPromises.has(promise)) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    const { timeoutId, reject } = pendingPromises.get(promise);

    clearTimeout(timeoutId);
    reject(new YError('E_DELAY_CLEARED'));
    pendingPromises.delete(promise);
    log('debug', 'Cleared a delay');
    return Promise.resolve();
  }

  function dispose() {
    return new Promise((resolve, reject) => {
      log('debug', 'Cancelling pending timeouts:', pendingPromises.size);
      resolve(Promise.all([...pendingPromises.keys()].map(clear)));
    });
  }
}
