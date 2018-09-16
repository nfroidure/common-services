import { initializer } from 'knifecycle';

function noop() {}

/* Architecture Note #1.7: Code generator

The `codeGenerator` service provide a service
 that generate random strings composed of
 a character set that avoid recognition
 mistake by humans.
*/

const EXPLICIT_CHARS = 'ABCDEFGHJKMNPRSTUVWXYZ23456789';

export default initializer(
  {
    name: 'codeGenerator',
    type: 'service',
    inject: ['?CHARS_SET', '?random', '?log'],
  },
  initCodeGeneratorService,
);

/**
 * Instantiate the codeGenerator service
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.CHARS_SET]
 * An optional char set to pick cars into
 * @param  {Object}   [services.random]
 * An optional random function to replace the
 * `Math.random` one used by default
 * @return {Promise<Function>}
 * @param  {Object}   [services.log]
 * An optional logging function
 * @return {Promise<Function>}
 * A promise of the codeGenerator function
 * @example
 * import initCodeGeneratorService from 'common-services/src/codeGenerator';
 *
 * const codeGenerator = await initCodeGeneratorService({
 *   log: console.log.bind(console),
 * });
 */
async function initCodeGeneratorService({
  CHARS_SET = EXPLICIT_CHARS,
  random = Math.random.bind(Math),
  log = noop,
}) {
  log('debug', `Code generation service Initialized!`);
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
  async function codeGenerator(length = 6) {
    const code = new Array(length)
      .fill('0')
      .map(() => CHARS_SET[Math.floor(random() * (charsSetLength - 1))])
      .join('');
    log('debug', `Generated a new code:`, code);
    return code;
  }
}
