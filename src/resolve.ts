import { autoService, singleton } from 'knifecycle';
import type { LogService } from './log.js';

function noop(): void {
  return undefined;
}

/* Architecture Note #1.5: Resolve

The `resolve` service is just proxying [`import.meta.resolve`
](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/import.meta/resolve)
 in a stubbable manner.
*/
export default singleton(autoService(initResolve));

export type ResolveService = (
  id: string,
  options?: { paths?: string[] },
) => string;

/**
 * Allow to resolve a path with the module system.
 * @param  {string} path
 * The serializable constants to gather
 * @return {Promise<string>}
 * A promise of a fully qualified module path
 */
async function initResolve({
  PROJECT_DIR,
  log = noop,
}: {
  PROJECT_DIR: string;
  log: LogService;
}): Promise<ResolveService> {
  log('debug', '🛂 - Initializing the resolve service!');
  // createRequire function can be injected by the compiler
  // and produce a reference error (duplicate identifier)
  // By importing it in the service directly, we avoid this potential error
  const module = await import('node:module');
  const require = module.default.createRequire(import.meta.url);

  return (
    path: Parameters<ResolveService>[0],
    options: Parameters<ResolveService>[1] = { paths: [PROJECT_DIR] },
  ) => {
    // To be replaced by import.meta.resolve
    // https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent
    // We currently resolve and remove .(c)js on the fly to
    // give a chance to the compiler to resolve to esm modules
    const fqPath = require.resolve(path, options);

    log('debug', `🛂 - Resolving "${path}" to "${fqPath}".`);
    return fqPath;
  };
}
