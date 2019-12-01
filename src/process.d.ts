import Knifecycle, { FatalErrorProvider } from 'knifecycle';
import { LogService } from './log';
declare const _default: typeof initProcess;
export default _default;
/**
 * Instantiate the process service
 * @name initProcess
 * @function
 * @param  {Object}   services
 * The services to inject
 * @return {Promise<Object>}
 * A promise of the process object
 */
declare function initProcess({
  NODE_ENV,
  PROCESS_NAME,
  SIGNALS,
  NODE_ENVS,
  log,
  exit,
  $instance,
  $fatalError,
}: {
  NODE_ENV: string;
  PROCESS_NAME?: string;
  SIGNALS?: string[];
  NODE_ENVS?: string[];
  exit: Function;
  $instance: Knifecycle;
  $fatalError: FatalErrorProvider;
  log?: LogService;
}): Promise<typeof global.process>;
