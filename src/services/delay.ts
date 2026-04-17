import { YError } from 'yerror';
import { autoProvider, singleton, location } from 'knifecycle';
import { noop } from '../utils/utils.js';
import { type LogService } from './log.js';

export type DelayResult = 'timeout' | 'cancel';
export interface DelayInfo {
  timeoutId: NodeJS.Timeout;
  resolve: (value: DelayResult | PromiseLike<DelayResult>) => void;
}

export interface DelayProvider {
  service: DelayService;
  dispose: () => Promise<void>;
}
export interface DelayService {
  create: (delay: number) => Promise<DelayResult>;
  clear: (promise: Promise<DelayResult>) => Promise<DelayResult>;
}

/**
 * Instantiate the delay service
 * @name initDelay
 * @function
 * @param  {Object}     services
 * The services to inject
 * @param  {Function}   [services.log=noop]
 * A logging function
 * @return {Promise<Object>}
 * A promise of the delay service
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initDelay,
 *   initLog,
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER
 * });
 *
 * const delay = await initDelay({
 *   log,
 * });
 */
async function initDelay({
  log = noop,
}: {
  log?: LogService;
}): Promise<DelayProvider> {
  const pendingPromises = new Map<
    Promise<DelayResult>,
    {
      timeoutId: NodeJS.Timeout;
      resolve: (value: DelayResult | PromiseLike<DelayResult>) => void;
    }
  >();

  log('debug', '⌛ - Delay service initialized.');

  return {
    service: {
      create,
      clear,
    },
    dispose,
  };

  /**
   * Create a new delay
   * @param  {Number}   delay  The delay in ms
   * @return {Promise}
   * A promise to be resolved after that delay
   * or rejected if it is cancelled.
   * @example
   * await delay.create(1000);
   * console.log('1000 ms elapsed!');
   */
  function create(delay: number) {
    const { promise, resolve } = Promise.withResolvers<DelayResult>();
    const timeoutId = setTimeout(() => {
      resolve('timeout');
      pendingPromises.delete(promise);
    }, delay);

    pendingPromises.set(promise, {
      timeoutId,
      resolve,
    });
    log('debug', '⏳ - Created a delay:', delay);
    return promise;
  }

  /**
   * Cancel an earlier created delay
   * @param  {Promise}   promise
   * The promise of the delay to cancel
   * @return {Promise}
   * A promise resolved when cancellation is done.
   * @example
   * const delayPromise = delay.create(1000);
   *
   * if('timeout' === await delayPromise)
   *   console.log('1000 ms elapsed!');
   * else
   *   console.log('Cancelled!'));
   */
  function clear(promise: Promise<DelayResult>) {
    if (!pendingPromises.has(promise)) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    const { timeoutId, resolve } = pendingPromises.get(promise) as DelayInfo;

    clearTimeout(timeoutId);
    resolve('cancel');
    pendingPromises.delete(promise);
    log('debug', '⏳ - Cleared a delay');
    return promise;
  }

  async function dispose() {
    log('debug', '⏳ - Cancelling pending timeouts:', pendingPromises.size);
    await Promise.all([...pendingPromises.keys()].map(clear));
  }
}

/* Architecture Note #1.4: Delay

The `delay` service is `setTimeout` like I would like it
 to be.
*/

export default location(singleton(autoProvider(initDelay)), import.meta.url);
