import { LogService } from './log';
import { DelayService } from './delay';
interface Lock {
  releasePromise: Promise<void>;
  release: Function;
}
interface LockServiceDependencies<K> {
  LOCKS_MAP?: Map<K, Lock[]>;
  log?: LogService;
  LOCK_TIMEOUT?: number;
  delay: DelayService;
}
export interface LockService<K> {
  take: (key: K) => Promise<void>;
  release: (key: K) => Promise<void>;
}
declare const _default: typeof initLock;
export default _default;
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
 *
 * const log = await initLogService({
 *   logger: require('winston'),
 *   debug: require('debug')('myapp'),
 * });
 * const delay = await initDelayService({ log });
 * const lock = await initLock({ LOCK_TIMEOUT: ms('5s'), delay, log });
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
declare function initLock<K>({
  LOCKS_MAP,
  LOCK_TIMEOUT,
  delay,
  log,
}: LockServiceDependencies<K>): Promise<LockService<K>>;
