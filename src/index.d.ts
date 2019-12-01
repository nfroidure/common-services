import initCodeGenerator, { CodeGeneratorService } from './codeGenerator';
import initCounter, { CounterService } from './counter';
import initDelay, { DelayProvider, DelayService } from './delay';
import initLock, { LockService } from './lock';
import initLog, { LogService } from './log';
import initTime, { TimeService } from './time';
import initRandom, { RandomService } from './random';
import initProcess from './process';
/**
 * All services of the `common-services` module as
 *  properties.
 * @constant
 * @type {Object}
 * @example
 * import * as COMMON_SERVICES from 'common-services';
 * import Knifecycle from 'knifecycle';
 *
 * new Knifecycle().register(
 *   ...Object.keys(COMMON_SERVICES)
 *   .map(serviceName => COMMON_SERVICES[serviceName])
 * );
 */
export {
  initCodeGenerator as initCodeGeneratorService,
  CodeGeneratorService,
  initCounter as initCounterService,
  CounterService,
  initDelay as initDelayService,
  DelayProvider,
  DelayService,
  initLock as initLockService,
  LockService,
  initLog as initLogService,
  LogService,
  initTime as initTimeService,
  TimeService,
  initRandom as initRandomService,
  RandomService,
  initProcess as initProcessService,
};
