/* eslint max-nested-callbacks:0 */
'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { Knifecycle } = require('knifecycle/dist');
const initDelayService = require('./delay');

describe('initDelayService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  test('should work', done => {
    initDelayService({
      log,
    })
      .then(delay => {
        assert('function' === typeof delay.service.create);
        assert('function' === typeof delay.service.clear);
        assert('function' === typeof delay.dispose);
        assert.deepEqual(log.args, [['debug', 'Delay service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });

  describe('delay.create', () => {
    let setTimeoutStub;

    beforeEach(() => {
      setTimeoutStub = sinon.stub(global, 'setTimeout');
    });

    afterEach(() => {
      setTimeoutStub.restore();
    });

    test('should work', done => {
      initDelayService({
        log,
      })
        .then(({ service: delay }) => {
          let delayPromise;

          log.reset();
          setTimeoutStub.returns({});

          delayPromise = delay.create(1000);
          assert.equal(setTimeoutStub.args.length, 1);
          assert.equal(setTimeoutStub.args[0][1], 1000);
          assert.deepEqual(log.args, [['debug', 'Created a delay:', 1000]]);
          // Run set callback
          setTimeoutStub.args[0][0]();

          return delayPromise;
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('delay.clear', () => {
    let setTimeoutStub;
    let clearTimeoutStub;

    beforeEach(() => {
      setTimeoutStub = sinon.stub(global, 'setTimeout');
      clearTimeoutStub = sinon.stub(global, 'clearTimeout');
      setTimeoutStub.returns({});
    });

    afterEach(() => {
      setTimeoutStub.restore();
      clearTimeoutStub.restore();
    });

    test('should fail with bad promise', done => {
      initDelayService({
        log,
      })
        .then(({ service: delay }) => {
          log.reset();

          return delay.clear(Promise.resolve()).catch(err => {
            assert.equal(err.code, 'E_BAD_DELAY');
          });
        })
        .then(() => done())
        .catch(done);
    });

    test('should work', done => {
      initDelayService({
        log,
      })
        .then(({ service: delay }) => {
          const delayPromise = delay.create(1000);

          log.reset();

          return Promise.all([
            delay.clear(delayPromise),
            delayPromise.catch(err => {
              assert.equal(err.code, 'E_DELAY_CLEARED');
            }),
          ]).then(() => {
            assert.deepEqual(log.args, [['debug', 'Cleared a delay']]);
          });
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', done => {
    new Knifecycle()
      .register(initDelayService)
      .constant('log', log)
      .run(['delay'])
      .then(({ delay }) => {
        assert(delay);
        assert.deepEqual(log.args, [['debug', 'Delay service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });
});
