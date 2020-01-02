import { LogService } from './log';
export interface CounterService {
  (): Promise<number>;
}
export declare type CounterServiceConfig = {
  COUNTER?: {
    firstCount: number;
  };
};
export declare type CounterServiceDependencies = CounterServiceConfig & {
  log?: LogService;
};
declare const _default: typeof initCounter;
export default _default;
/**
 * Instantiate the counter service
 * @name initCounter
 * @function
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.COUNTER=DEFAULT_COUNTER]
 * An optional configuration object
 * @param  {Object}   [services.log=noop]
 * An optional logging function
 * @return {Promise<Function>}
 * A promise of the counter function
 * @example
 * import initCounter from 'common-services/dist/counter';
 *
 * const counter = await initCounter({
 *   COUNTER: { firstCount: 1 },
 *   log: console.log.bind(console),
 * });
 */
declare function initCounter({
  COUNTER,
  log,
}: CounterServiceDependencies): Promise<CounterService>;
