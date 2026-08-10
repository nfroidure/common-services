import { autoService, singleton, location } from 'knifecycle';
import { noop } from '../utils/utils.js';
import { type LogService } from './log.js';
import { randomUUID as _randomUUID, RandomUUIDOptions } from 'node:crypto';

export type RandomUUIDService = typeof _randomUUID;

/**
 * Instantiate the random UUID service
 * @name initRandom
 * @function
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the random UUID function
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initLog,
 *   initRandomUUID
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER,
 * });
 *
 * const random = await initRandomUUID({
 *   log,
 * });
 */
async function initRandomUUID({
  log = noop,
}: {
  log?: LogService;
}): Promise<RandomUUIDService> {
  log('debug', '🎲 - Random UUID service initialized.');

  /**
   * Returns a new random UUID
   * @param  {object} options   The node randomUUID options
   * @return {string}   The random UUID
   * @example
   * randomUUID()
   * // Prints: abbacaca-abba-caca-abba-cacaabbacaca
   */
  function randomUUID(
    options?: RandomUUIDOptions | undefined,
  ): ReturnType<RandomUUIDService> {
    const uuid = _randomUUID(options);

    log('debug', '🎲 - Created a random UUID:', uuid);

    return uuid;
  }

  return randomUUID;
}

/* Architecture Note #1.13: Random UUID

The `randomUUID` service is just proxying NodeJS
 randomUUID in a easily mockable manner.
*/

export default location(
  singleton(autoService(initRandomUUID)),
  import.meta.url,
);
