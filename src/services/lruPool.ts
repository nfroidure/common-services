import { autoProvider, name, location } from 'knifecycle';
import { noop } from '../utils/utils.js';
import type { LogService } from './log.js';
import { type JsonValue } from 'type-fest';
import { type DelayService } from './delay.js';
import { type YError, printStackTrace } from 'yerror';

export type LRUPoolManagerService<T, U extends JsonValue> = {
  create: (config: U) => Promise<T>;
  release: (item: T) => Promise<void>;
};
export type LRUPoolServiceConfig = {
  MAX_POOL_SIZE: number;
  POOL_TTL?: number;
};
export type LRUPoolServiceDependencies<
  T,
  U extends JsonValue,
> = LRUPoolServiceConfig & {
  poolManager: LRUPoolManagerService<T, U>;
  delay: DelayService;
  log?: LogService;
};
export type LRUPoolService<T, U extends JsonValue> = {
  use: (config: U) => Promise<T>;
};

export interface LRUPoolProvider<T, U extends JsonValue> {
  service: LRUPoolService<T, U>;
  dispose: () => Promise<void>;
}

/* Architecture Note #1.10: LRU Pool

The `lruPool` service allows to maintain a pool of
  resources. It is meant to be used with resources
  like file descriptors that are limited in most
  OSes but are pointing to completely different
  kind of resources (files paths varies).
*/

export default location(
  name('lruPool', autoProvider(initLRUPool)),
  import.meta.url,
) as typeof initLRUPool;

/**
 * Instantiate the LRU Pool service
 * @name initRandom
 * @function
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the LRUPool service
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initLog,
 *   initLRUPool
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER,
 * });
 *
 * const random = await initLRUPool({
 *   MAX_POOL_SIZE: 50,
 *   poolManager: {
 *     // ...
 *   },
 *   log,
 * });
 */

export async function initLRUPool<T, U extends JsonValue>({
  MAX_POOL_SIZE,
  POOL_TTL,
  poolManager,
  delay,
  log = noop,
}: LRUPoolServiceDependencies<T, U>) {
  log('warning', `✅ - Initializing a LRU pool service.`);

  const poolMap = new Map<string, T>();
  const delayMap = new Map<string, Promise<void>>();
  const poolLRUQueue: string[] = [];
  const service = {
    async use(config: U): Promise<T> {
      if (poolLRUQueue.length >= MAX_POOL_SIZE) {
        const key = poolLRUQueue.shift() as string;
        const item = poolMap.get(key) as T;

        log('debug', `🧹 - Pool is full, releasing an item (${key}).`);

        await poolManager.release(item);
        poolMap.delete(key);
        if (delayMap.has(key)) {
          delay.clear(delayMap.get(key) as Promise<void>);
          delayMap.delete(key);
        }
      }
      const key = JSON.stringify(config);
      let item: T;

      if (poolMap.has(key)) {
        item = poolMap.get(key) as T;
        poolLRUQueue.splice(poolLRUQueue.indexOf(key), 1);

        log('debug', `♻️ - Reusing an item from the pool (${key}).`);
      } else {
        log('debug', `➕ - Creating an item from the pool.`);
        item = await poolManager.create(config);
        poolMap.set(key, item);

        if (POOL_TTL) {
          const delayPromise = delay.create(POOL_TTL);

          delayMap.set(key, delayPromise);
          delayPromise
            .then(() => {
              if (poolMap.has(key)) {
                poolLRUQueue.splice(poolLRUQueue.indexOf(key), 1);
                poolMap.delete(key);
                delayMap.delete(key);
                log('debug', `🧹 - Pool is releasing an item by ttl (${key}).`);
                return poolManager.release(item);
              }
            })
            .catch((err) => {
              if ((err as YError).code === 'E_DELAY_CLEARED') {
                return;
              }
              log('error', `🛑 - Delayed release error (${key}).`);
              log('error-stack', printStackTrace(err));
            });
        }
      }

      poolLRUQueue.push(key);

      return item;
    },
  };
  const dispose = async () => {
    for (const item of poolMap.values()) {
      await poolManager.release(item);
    }
    poolMap.clear();
    for (const item of delayMap.values()) {
      await delay.clear(item);
    }
    delayMap.clear();
    poolLRUQueue.length = 0;
  };

  return { service, dispose };
}
