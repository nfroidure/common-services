import { autoService, singleton } from 'knifecycle';
import { printStackTrace, YError } from 'yerror';
import type { LogService } from './log.js';

function noop(): void {
  return undefined;
}

/* Architecture Note #1.6: Importer

The `importer` service is just proxying [`import`
](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/import)
 in a stubbable manner.
*/
export default singleton(autoService(initImporter)) as typeof initImporter;

export type ImporterService<M> = (path: string) => Promise<M>;

/**
 * Allow to import ES modules.
 * @param  {string} path
 * The module path
 * @return {Promise<Object>}
 * A promise of an imported module.
 */
async function initImporter<M>({
  log = noop,
}: {
  log: LogService;
}): Promise<ImporterService<M>> {
  const importer = async (path: string) => {
    log('debug', `🛂 - Dynamic import of "${path}".`);
    try {
      return await import(path);
    } catch (err) {
      log('debug', `⚠️ - Got a runtime import error for "${path}" !`);
      log('debug-stack', printStackTrace(err as Error));
      throw YError.wrap(err as Error, 'E_RUNTIME_IMPORT_FAILURE', path);
    }
  };

  log('debug', '🛂 - Initializing the importer!');

  return importer;
}
