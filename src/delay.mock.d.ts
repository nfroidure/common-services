declare const _default: typeof initDelayMock;
export default _default;
/**
 * Instantiate the delay service mock
 * @name initDelayMock
 * @function
 * @return {Promise<Object>}
 * A promise of the mocked delay service
 * @example
 * import initDelayMock from 'common-services/dist/delay.mock';
 * import assert from 'assert';
 *
 * const delay = await initDelayMock();
 *
 * const delayPromise = delay.create(1000);
 *
 * delay.resolve(delayPromise);
 *
 * delayPromise.then(() => {
 *   // Any code here will execute immediatly
 *   // instead of after a 1000ms delay
 * });
 */
declare function initDelayMock(
  _: any,
): Promise<{
  service: {
    create: (delay: number) => Promise<void>;
    clear: (promise: Promise<any>) => Promise<void>;
    __resolve: (promise: Promise<any>) => Promise<void>;
    __resolveAll: () => Promise<void>;
    __reject: (promise: Promise<any>) => Promise<void>;
    __rejectAll: () => Promise<void>;
  };
}>;
