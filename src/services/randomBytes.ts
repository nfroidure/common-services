import { autoService, singleton, location } from 'knifecycle';
import { noop } from '../utils/utils.js';
import { type LogService } from './log.js';
import { randomBytes as _randomBytes } from '../utils/crypto.js';

export type RandomBytesService = typeof _randomBytes;

/**
 * Instantiate the random bytes service
 * @name initRandomBytes
 * @function
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the random bytes function
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initLog,
 *   initRandomBytes
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER,
 * });
 *
 * const randomBytes = await initRandomBytes({
 *   log,
 * });
 */
async function initRandomBytes({
  log = noop,
}: {
  log?: LogService;
}): Promise<RandomBytesService> {
  log('debug', '🎲 - Random bytes service initialized.');

  /**
   * Returns new random bytes
   * @param  {number} length   The random bytes size
   * @return {Promise<Buffer>}   The random bytes
   * @example
   * await randomBytes(16)
   * // Prints: <buffer>
   */
  async function randomBytes(length: number): ReturnType<RandomBytesService> {
    const bytes = await _randomBytes(length);

    log('debug', `🎲 - Created random bytes (length: ${length}).`);

    return bytes;
  }

  return randomBytes;
}

/* Architecture Note #1.14: Random Bytes

The `randomBytes` service is just proxying NodeJS
 randomBytes in an easily mockable manner.
*/

export default location(
  singleton(autoService(initRandomBytes)),
  import.meta.url,
);
