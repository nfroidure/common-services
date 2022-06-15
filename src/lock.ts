import { YError } from 'yerror';
import { autoService, singleton } from 'knifecycle';
import type { LogService } from './log.js';
import type { DelayService } from './delay.js';

const noop = () => undefined;

interface Lock {
  releasePromise: Promise<void>;
  release: () => void;
}

export type LockServiceConfig<K> = {
  LOCKS_MAP?: Map<K, Lock[]>;
  LOCK_TIMEOUT?: number;
};

type LockServiceDependencies<K> = LockServiceConfig<K> & {
  log?: LogService;
  delay: DelayService;
};

export interface LockService<K> {
  take: (key: K, timeout?: number) => Promise<void>;
  release: (key: K) => Promise<void>;
}

/* Architecture Note #1.8: Lock

This service allows to maintain a lock on a given resource in order
 to ensure a sequential access to it in asynchronous code.

The release is done by its key and the current lock is removed. There
 is no check on the fact the lock is well released. By design, it is
 your responsibility to ensure you release the locks properly. That
 said, it should not be hard to handle since the actual behavior of
 the library makes your code run sequentially.
*/
export default singleton(autoService(initLock)) as typeof initLock;

/**
 * Instantiate the lock service
 * @name initLock
 * @function
 * @param  {Object}     services
 * The services to inject
 * @param  {Map}   [services.LOCKS_MAP]
 * A map to store le current locks (optional)
 * @param  {Number}   [services.LOCK_TIMEOUT=Infitiny]
 * The timeout in milliseconds for the lock to
 *  be released.
 * @param  {Function}   [services.log]
 * A logging function
 * @param  {Object}   [services.delay]
 * A delay service like the `common-services` one
 * @return {Promise<Object>}
 * A promise of the lock service
 * @example
 * import initLog from 'common-services/dist/log';
 * import initDelayService from 'common-services/dist/delay';
 * import initLock from 'common-services/dist/lock';
 * import ms from 'ms';
 * import winston from 'winston';
 * import debug from 'debug';
 *
 * const log = await initLogService({
 *   logger: winston,
 *   debug: debug('myapp'),
 * });
 * const delay = await initDelayService({ log });
 * const lock = await initLock ({ LOCK_TIMEOUT: ms('5s'), delay, log });
 *
 *
 * run();
 *
 * async function run() {
 *   // The following async jobs are done sequentially
 *   // if they have the same `resourceKey` value
 *   await Promise.all(asynTasks.map(async (asyncTask) => {
 *     await lock.take(asyncTask.resourceKey);
 *
 *     await myAsyncStuff1(asyncTask);
 *     await myAsyncStuff2(asyncTask);
 *     await myAsyncStuff3(asyncTask);
 *
 *    lock.release(asyncTask.resourceKey);
 *   });
 * }
 */
async function initLock<T>({
  LOCKS_MAP = new Map(),
  LOCK_TIMEOUT = Infinity,
  delay,
  log = noop,
}: LockServiceDependencies<T>): Promise<LockService<T>> {
  log('debug', '🔒 - Lock service initialized.');

  return {
    take,
    release,
  };

  /**
   * Take the lock on the given resource key
   * @param  {String}   key
   * A unique key for the locked resource
   * @return {Promise}
   * A promise to be resolved when the lock
   *  is gained or rejected if the lock release
   *  timeout is reached.
   */
  async function take(key, timeout = LOCK_TIMEOUT) {
    const keyLocks = LOCKS_MAP.get(key) || [];
    const locksLength = keyLocks.length;
    const previousLock = keyLocks[locksLength - 1];

    if (locksLength === 0) {
      LOCKS_MAP.set(key, keyLocks);
    }

    log(
      'debug',
      `🔐 - Demanding the lock on "${key}" (queue length was ${locksLength})`,
    );

    let _resolve: () => void = () => undefined;
    const releasePromise: Promise<void> = new Promise((resolve, reject) => {
      _resolve = resolve;

      if (timeout !== Infinity) {
        delay
          .create(timeout)
          .then(() => reject(new YError('E_LOCK_TIMEOUT', timeout)));
      }
    });

    const newLock = {
      releasePromise,
      release: _resolve,
    };

    keyLocks.push(newLock);

    if (previousLock) {
      log(
        'debug',
        `🔐 - Waiting the lock on "${key}" (queue length was ${locksLength})`,
      );
      await previousLock.releasePromise;
    }

    log(
      'debug',
      `🔐 - Obtaining the lock on "${key}" (queue length was ${locksLength})`,
    );
  }

  /**
   * Release the lock on the given resource key
   * @param  {String}   key  A unique key for the resource to release
   * @return {void}
   */
  async function release(key) {
    const keyLocks = LOCKS_MAP.get(key) || [];
    const locksLength = keyLocks.length;

    if (!locksLength) {
      throw new YError('E_NO_LOCK', key);
    }

    log(
      'debug',
      `🔓 - Releasing the lock on "${key}" (queue length was ${locksLength})`,
    );
    (keyLocks.shift() as Lock).release();

    if (keyLocks.length === 0) {
      LOCKS_MAP.delete(key);
    }
  }
}
