import { autoService, singleton, location } from 'knifecycle';
import { noop } from '../utils/utils.js';
import { type LogService } from './log.js';

export type ResolveService = (id: string) => string;

/**
 * Instantiate the `resolve` service
 * @name initResolve
 * @function
 * @param  {Object}     services
 * The services to inject
 * @param  {String}   services.MAIN_FILE_URL
 * An URL pointing to the main file run
 * @param  {Function}   [services.log]
 * A logging function
 * @param  {Function}   [services.importMetaResolve]
 * A custom resolver function (defaults to `import.meta.resolve`)
 * @return {Promise<Function>}
 * A promise of the `resolve` service
 * @example
 * import {
 *   DEFAULT_LOGGER,
 *   initLog,
 *   initResolve,
 * } from 'common-services';
 *
 * const log = await initLog({
 *   logger: DEFAULT_LOGGER,
 * });
 *
 * const resolve = initResolve({
 *   MAIN_FILE_URL: import.meta.url,
 *   log,
 * });
 *
 * resolve('./myfile.ts');
 * }
 */
async function initResolve({
  MAIN_FILE_URL,
  log = noop,
  importMetaResolve = import.meta.resolve,
}: {
  MAIN_FILE_URL: string;
  log: LogService;
  importMetaResolve?: ResolveService;
}): Promise<ResolveService> {
  log(
    'debug',
    `🛂 - Initializing the resolve service (resolving from "${MAIN_FILE_URL}")!`,
  );

  /**
   * Allow to resolve a path with the module system.
   * @name resolve
   * @function
   * @param  {string} path
   * The serializable constants to gather
   * @return {Promise<string>}
   * A promise of a fully qualified module path
   */
  return (path) => {
    const moduleIsRelative = path.startsWith('.');
    const idToResolve = moduleIsRelative
      ? new URL(path, MAIN_FILE_URL).toString()
      : path;

    const fqPath = importMetaResolve(idToResolve);

    log('debug', `🛂 - Resolving "${path}" to "${fqPath}".`);
    return fqPath;
  };
}

/* Architecture Note #1.5: Resolve

The `resolve` service is just proxying [`import.meta.resolve`
](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/import.meta/resolve)
 in a mockable manner.
*/
export default location(singleton(autoService(initResolve)), import.meta.url);
