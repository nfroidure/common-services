import { LogService } from './log';
export interface DelayProvider {
  service: DelayService;
  dispose: () => Promise<void>;
}
export interface DelayService {
  create: (delay: number) => Promise<void>;
  clear: (promise: Promise<void>) => Promise<void>;
}
declare const _default: typeof initDelay;
export default _default;
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
 * import initDelay from 'common-services/dist/delay';
 *
 * const delay = await initDelay({
 *   log: console.log.bind(console)
 * });
 */
declare function initDelay({
  log,
}: {
  log?: LogService;
}): Promise<DelayProvider>;
