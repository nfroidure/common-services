export interface LogService {
  (...args: any[]): void;
}
export declare enum StdStream {
  STD_OUT = 'STD_OUT',
  STD_ERR = 'STD_ERR',
}
export interface Logger {
  [name: string]: LogService;
}
declare const _default: typeof initLog;
export default _default;
/**
 * Instantiate the logging service
 * @name initLog
 * @function
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.logger = DEFAULT_LOGGER]
 * The logger to use
 * @param  {Function} [services.debug = noop]
 * A debugging function
 * @return {Promise<Function>}
 * A promise of the logging function
 * @example
 * import initLog from 'common-services/dist/log';
 *
 * const log = await initLog({
 *   logger: require('winston'),
 *   debug: require('debug')('myapp'),
 *  });
 */
declare function initLog({
  LOG_ROUTING,
  logger,
  debug,
}: {
  LOG_ROUTING?: {
    [type: string]: StdStream;
  };
  logger?: Logger;
  debug?: LogService;
}): Promise<(type: string, ...args: any[]) => void>;
