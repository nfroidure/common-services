import { autoService, location } from 'knifecycle';
import { noop } from '../utils/utils.js';
import { type LogService } from './log.js';
import { type RandomService } from './random.js';

export type CodeGeneratorServiceConfig = {
  CHARS_SET?: string;
};
export type CodeGeneratorServiceDependencies = CodeGeneratorServiceConfig & {
  random: RandomService;
  log?: LogService;
};
export interface CodeGeneratorService {
  (length?: number): Promise<string>;
}

const EXPLICIT_CHARS = 'ABCDEFGHJKMNPRSTUVWXYZ23456789';

/**
 * Instantiate the codeGenerator service
 * @name initCodeGenerator
 * @function
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.CHARS_SET = EXPLICIT_CHARS]
 * An optional char set to pick cars into
 * @param  {Object}   [services.random = Math.random]
 * An optional random function to replace the
 * `Math.random` one used by default
 * @return {Promise<Function>}
 * @param  {Object}   [services.log = noop]
 * An optional logging function
 * @return {Promise<Function>}
 * A promise of the codeGenerator function
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initCodeGenerator,
 *   initLog,
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER,
 * });
 *
 * const codeGenerator = await initCodeGenerator({
 *   log,
 * });
 */
async function initCodeGenerator({
  CHARS_SET = EXPLICIT_CHARS,
  random = Math.random.bind(Math),
  log = noop,
}: CodeGeneratorServiceDependencies): Promise<CodeGeneratorService> {
  log('debug', `↪️ - Code generation service Initialized!`);
  const charsSetLength = CHARS_SET.length;

  return codeGenerator;

  /**
   * Returns a random code
   * @param  {Number}   [length]
   * An optional custon code length (defaults to 6)
   * @return {Promise<String>}
   * A promise of the generated code
   * @example
   * console.log([
   *   codeGenerator(),
   *   codeGenerator(),
   *   codeGenerator(),
   * ]);
   * // Prints: ABCDEF,GHJKMN,PRSTUV
   */
  async function codeGenerator(length = 6): Promise<string> {
    const code = new Array(length)
      .fill('0')
      .map(() => CHARS_SET[Math.floor(random() * (charsSetLength - 1))])
      .join('');
    log('debug', `↪️ - Generated a new code:`, code);
    return code;
  }
}

/* Architecture Note #1.7: Code generator

The `codeGenerator` service provide a service
 that generate random strings composed of
 a character set that avoid recognition
 mistake by humans.

It generates codes that contains only easily
 recognizable chars (by example, no `0` nor `O`).
*/
export default location(autoService(initCodeGenerator), import.meta.url);
