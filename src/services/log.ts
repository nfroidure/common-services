import { autoService, singleton } from 'knifecycle';
import type { JsonValue } from 'type-fest';
import { DEFAULT_LOGGER } from './logger.js';

export type LogConfig = {
  stringify: boolean;
};
export interface LogFunction {
  (...args: JsonValue[]): void;
}
export interface Logger {
  error: (message: string) => void;
  output: (message: string) => void;
  debug: (...args: JsonValue[]) => void;
}
export enum LogOutputTypes {
  OUTPUT = 'output',
  ERROR = 'error',
  DEBUG = 'debug',
  NONE = 'none',
}
export type LogTypes =
  | 'debug'
  | 'error'
  | 'info'
  | 'warning'
  | 'error-stack'
  | 'debug-stack';
export interface LogService {
  (type: LogTypes, ...args: JsonValue[]): void;
}

export const DEFAULT_LOG_CONFIG: LogConfig = {
  stringify: false,
};
export const DEFAULT_LOG_ROUTING: Record<LogTypes, LogOutputTypes> = {
  error: LogOutputTypes.ERROR,
  debug: LogOutputTypes.DEBUG,
  warning: LogOutputTypes.ERROR,
  info: LogOutputTypes.OUTPUT,
  // The stack type allows to filter logs in testing
  // since the stack files paths vary between systems
  // and it is annoying to filter them
  'error-stack': LogOutputTypes.ERROR,
  'debug-stack': LogOutputTypes.DEBUG,
};

export type LogServiceConfig = {
  LOG_CONFIG?: LogConfig;
  LOG_ROUTING?: { [type: string]: LogOutputTypes };
};
export type LogServiceDependencies = LogServiceConfig & {
  logger: Logger;
};

/* Architecture Note #1.1: Log

I prefer using a unique function with the `log` type
 in parameter instead of several methods for each
 log types. It is far easyer to mock and to assert
 on logs in my tests.

If provided, I route debug messages to the `debug`
 node module.

*/

export default singleton(autoService(initLog));

/**
 * Instantiate the logging service
 * @name initLog
 * @function
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   services.logger
 * The logger object that output the logs
 * @return {Promise<Function>}
 * A promise of the logging function
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initLog,
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER,
 * });
 */
async function initLog({
  LOG_CONFIG = DEFAULT_LOG_CONFIG,
  LOG_ROUTING = DEFAULT_LOG_ROUTING,
  logger = DEFAULT_LOGGER,
}: LogServiceDependencies) {
  log('debug', '👣 - Logging service initialized.');

  return log;

  /**
   * Logging function
   * @param  {String}  type
   * Log type
   * @param  {...*}    args
   * Log contents
   * @return {void}
   * @example
   * log('debug', 'Luke, I am your father!')
   */
  function log(type: LogTypes, ...args: JsonValue[]): void {
    const output = args
      .map((arg) =>
        LOG_CONFIG.stringify
          ? JSON.stringify(arg)
          : arg != null
            ? arg.toString()
            : '',
      )
      .join(' ');

    if (LOG_ROUTING[type] === LogOutputTypes.NONE) {
      return;
    }
    if (LOG_ROUTING[type] === LogOutputTypes.ERROR) {
      logger.error(output);
      return;
    }
    if (LOG_ROUTING[type] === LogOutputTypes.OUTPUT) {
      logger.output(output);
      return;
    }
    logger.debug(...args);
  }
}
