import YError from 'yerror';
import { initializer } from 'knifecycle';

const DEFAULT_NODE_ENVS = ['development', 'test', 'production'];
const DEFAULT_SIGNALS = ['SIGTERM', 'SIGINT'];

function noop() {}

/* Architecture Note #1.5: Process
The `process` service takes care of the process status.

It returns nothing and should be injected only for its
 side effects.
*/

export default initializer(
  {
    name: 'process',
    type: 'service',
    inject: [
      'NODE_ENV',
      '?PROCESS_NAME',
      '?SIGNALS',
      '?NODE_ENVS',
      '?log',
      'exit',
      '$destroy',
      '$fatalError',
    ],
    options: { singleton: true },
  },
  initProcessService,
);

async function initProcessService({
  NODE_ENV,
  PROCESS_NAME,
  SIGNALS,
  NODE_ENVS,
  log = noop,
  exit,
  $destroy,
  $fatalError,
}) {
  let shuttingDown = null;

  /* Architecture Note #1.5.1: Node environment filtering

  It also forces NODE_ENV to be set to avoid unintentionnal
   development version shipping to production. You can specify
   your own list of valid environments by injecting the
   `SIGNALS` optional dependency.
  */
  if (!(NODE_ENVS || DEFAULT_NODE_ENVS).includes(NODE_ENV)) {
    throw new YError('E_NODE_ENV', NODE_ENV);
  }

  log('debug', `Running in "${NODE_ENV}" environment.`);

  global.process.title =
    (PROCESS_NAME || global.process.title) + ' - ' + NODE_ENV;

  /* Architecture Note #1.5.2: Signals handling

  It also handle SIGINT and SIGTERM signals to allow to
   gracefully shutdown the running process. The signals
   to handle can be customized by injecting the `SIGNALS`
   optional dependencies.
  */
  (SIGNALS || DEFAULT_SIGNALS).forEach(signal => {
    global.process.on(signal, terminate.bind(null, signal));
  });

  /* Architecture Note #1.5.3: Handling services fatal errors

  If an error occurs it attempts to gracefully exit
  to give it a chance to finish properly.
  */
  $fatalError.promise.catch(err => {
    log('error', 'Fatal error:', err.stack || err);
    terminate('FATAL');
  });

  /* Architecture Note #1.5.4: Uncaught exceptions

  If an uncaught exeption occurs it also attempts to
   gracefully exit since a process should never be kept
   alive when an uncaught exception is raised.
  */
  global.process.on('uncaughtException', err => {
    log('error', 'Uncaught Exception:', err.stack || err);
    terminate('ERR');
  });

  function terminate(signal) {
    if (shuttingDown) {
      log('debug', `${signal} received again, shutdown now.`);
      exit(1);
    } else {
      log('debug', `${signal} received. Send it again to kill me instantly.`);
      shutdown(['ERR', 'FATAL'].includes(signal) ? 1 : 0);
    }
  }

  async function shutdown(code) {
    shuttingDown = true;
    log('info', 'Shutting down now 🙏...');
    await $destroy();

    try {
      log('info', 'Gracefull shutdown sucessfully done 😎!');
      exit(code || 0);
    } catch (err) {
      log('error', 'Could not gracefully shutdown 🤔.', err.stack);
      exit(1);
    }
  }

  log('debug', 'Process service initialized.');
}
