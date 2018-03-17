'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { Knifecycle } = require('knifecycle/dist');
const initTimeService = require('./time');

describe('initTimeService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  test('should work', done => {
    initTimeService({
      log,
    })
      .then(time => {
        assert('function' === typeof time);
        assert.deepEqual(log.args, [['debug', 'Time service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });

  describe('time', () => {
    test('should work', done => {
      initTimeService({
        log,
      })
        .then(time => {
          log.reset();
          const now = time();

          assert.deepEqual(log.args, [['debug', 'Picked a timestamp:', now]]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', done => {
    new Knifecycle()
      .register(initTimeService)
      .constant('log', log)
      .run(['time'])
      .then(({ time }) => {
        assert(time);
        assert.deepEqual(log.args, [['debug', 'Time service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });
});
