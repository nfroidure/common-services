import { LogService } from './log';
import { RandomService } from './random';
export interface CodeGeneratorService {
  (length?: number): Promise<string>;
}
declare const _default: typeof initCodeGenerator;
export default _default;
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
 * import initCodeGenerator from 'common-services/dist/codeGenerator';
 *
 * const codeGenerator = await initCodeGenerator({
 *   log: console.log.bind(console),
 * });
 */
declare function initCodeGenerator({
  CHARS_SET,
  random,
  log,
}: {
  CHARS_SET?: string;
  random: RandomService;
  log?: LogService;
}): Promise<CodeGeneratorService>;
