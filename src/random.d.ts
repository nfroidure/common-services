import { LogService } from './log';
export interface RandomService {
  (): number;
}
declare const _default: typeof initRandom;
export default _default;
/**
 * Instantiate the random service
 * @name initRandom
 * @function
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
declare function initRandom({
  log,
}: {
  log?: LogService;
}): Promise<RandomService>;
