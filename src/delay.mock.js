import YError from 'yerror';
import initDelayService from './delay';
import { reuseSpecialProps } from 'knifecycle/dist/util';

/* Architecture Note #1.4.1: Mocking delays

This mock is largely inspired by the `$timeout` one of
 AngularJS. It allows to resolve/reject pending delays
 for testing. That said, it does it asynchronously
 where the former one was synchronous. This is not a
 bug but a design choice to keep the closest possible
 to what would happen in actual code.
*/

export default reuseSpecialProps(initDelayService, initDelayMock);

/**
 * Instantiate the delay service mock
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
function initDelayMock() {
  const pendingPromises = [];

  return Promise.resolve({
    service: {
      create,
      clear,
      __resolve,
      __resolveAll,
      __reject,
      __rejectAll,
    },
  });

  function create() {
    let _resolve;
    let _reject;
    const promise = new Promise((resolve, reject) => {
      _reject = reject;
      _resolve = resolve;
    });

    pendingPromises.push({
      promise,
      resolve: _resolve,
      reject: _reject,
    });
    return promise;
  }

  function clear(promise) {
    const pendingPromiseIndex = pendingPromises.findIndex(
      pendingPromise => pendingPromise.promise === promise,
    );

    if (-1 === pendingPromiseIndex) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    pendingPromises[pendingPromiseIndex].reject(new YError('E_DELAY_CLEARED'));
    pendingPromises.splice(pendingPromiseIndex, 1);
    return Promise.resolve();
  }

  function __resolve(promise) {
    const pendingPromise = pendingPromises.find(
      pendingPromise => pendingPromise.promise === promise,
    );

    if (!pendingPromise) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    pendingPromise.resolve();
    return Promise.resolve().then(__delete.bind(null, promise));
  }

  function __resolveAll() {
    return Promise.all(
      pendingPromises.map(({ promise }) => __resolve(promise)),
    );
  }

  function __reject(promise) {
    const pendingPromise = pendingPromises.find(
      pendingPromise => pendingPromise.promise === promise,
    );

    if (!pendingPromise) {
      return Promise.reject(new YError('E_BAD_DELAY'));
    }
    pendingPromise.reject(new YError('E_DELAY_CLEARED'));
    return Promise.resolve().then(__delete.bind(null, promise));
  }

  function __rejectAll() {
    return Promise.all(pendingPromises.map(({ promise }) => __reject(promise)));
  }

  function __delete(promise) {
    const pendingPromiseIndex = pendingPromises.findIndex(
      pendingPromise => pendingPromise.promise === promise,
    );
    pendingPromises.splice(pendingPromiseIndex, 1);
  }
}
