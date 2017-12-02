/* eslint max-nested-callbacks:0 */
'use strict';

const assert = require('assert');
const YError = require('yerror');
const initDelayMock = require('./delay.mock');

describe('initDelayMock', () => {
  it('should work', done => {
    initDelayMock()
      .then(
        ({
          service: {
            create,
            clear,
            __resolve,
            __resolveAll,
            __reject,
            __rejectAll,
          },
        }) => {
          assert('function' === typeof create);
          assert('function' === typeof clear);
          assert('function' === typeof __resolve);
          assert('function' === typeof __resolveAll);
          assert('function' === typeof __reject);
          assert('function' === typeof __rejectAll);
        }
      )
      .then(() => done())
      .catch(done);
  });

  describe('_resolve', () => {
    it('should work', done => {
      initDelayMock()
        .then(({ service: { create, __resolve } }) => {
          const delayPromise = create(1000);

          return Promise.resolve([__resolve(delayPromise), delayPromise]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('_resolveAll', () => {
    it('should work with no pending delays', done => {
      initDelayMock()
        .then(({ service: { __resolveAll } }) => __resolveAll())
        .then(() => done())
        .catch(done);
    });

    it('should work with one pending delay', done => {
      initDelayMock()
        .then(({ service: { create, __resolveAll } }) => {
          const delayPromise = create(1000);

          return Promise.all([delayPromise, __resolveAll()]);
        })
        .then(() => done())
        .catch(done);
    });

    it('should work with 10 pending delays', done => {
      initDelayMock()
        .then(({ service: { create, __resolveAll } }) => {
          const delayPromises = new Array(10).fill(1).map(() => create(1000));

          return Promise.all([__resolveAll(), ...delayPromises]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('_reject', () => {
    it('should work', done => {
      initDelayMock()
        .then(({ service: { create, __reject } }) => {
          const delayPromise = create(1000);

          return Promise.all([
            __reject(delayPromise),
            delayPromise
              .then(() => {
                throw new YError('E_UNEXPECTED_SUCCESS');
              })
              .catch(err => {
                assert.equal(err.code, 'E_DELAY_CLEARED');
              }),
          ]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('_rejectAll', () => {
    it('should work with no pending delays', done => {
      initDelayMock()
        .then(({ service: { __rejectAll } }) => __rejectAll())
        .then(() => done())
        .catch(done);
    });

    it('should work with one pending delay', done => {
      initDelayMock()
        .then(({ service: { create, __rejectAll } }) => {
          const delayPromise = create(1000);

          return Promise.all([
            delayPromise
              .then(() => {
                throw new YError('E_UNEXPECTED_SUCCESS');
              })
              .catch(err => {
                assert.equal(err.code, 'E_DELAY_CLEARED');
              }),
            __rejectAll(),
          ]);
        })
        .then(() => done())
        .catch(done);
    });

    it('should work with 10 pending delays', done => {
      initDelayMock()
        .then(({ service: { create, __rejectAll } }) => {
          const delayPromises = new Array(10)
            .fill(1)
            .map(() => create(1000))
            .map(delayPromise =>
              delayPromise
                .then(() => {
                  throw new YError('E_UNEXPECTED_SUCCESS');
                })
                .catch(err => {
                  assert.equal(err.code, 'E_DELAY_CLEARED');
                })
            );

          return Promise.all([__rejectAll(), ...delayPromises]);
        })
        .then(() => done())
        .catch(done);
    });
  });
});
