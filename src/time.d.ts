import { LogService } from './log';
export interface TimeService {
  (): number;
}
declare const _default: typeof initTime;
export default _default;
/**
 * Instantiate the time service
 * @name initTime
 * @function
 * @param  {Object}   services           The services to inject
 * @param  {Object}   [services.log = noop]     A logging function
 * @return {Promise<Function>}           A promise of the time function
 * @example
 * import initTime from 'common-services/dist/time';
 *
 * const time = await initTime({
 *   log: console.log.bind(console),
 * });
 */
declare function initTime({ log }: { log?: LogService }): Promise<TimeService>;
