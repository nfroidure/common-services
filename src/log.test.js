'use strict';

import assert from 'assert';
import sinon from 'sinon';
import { Knifecycle } from 'knifecycle/dist';
import initLogService from './log';

describe('initLogService', () => {
  const debug = sinon.stub();
  const logger = {
    error: sinon.stub(),
    info: sinon.stub(),
  };

  beforeEach(() => {
    debug.reset();
    logger.info.reset();
    logger.error.reset();
  });

  test('should work', done => {
    initLogService({
      debug,
      logger,
    })
      .then(fn => {
        assert('function' === typeof fn);
        assert.deepEqual(debug.args, [['Logging service initialized.']]);
        assert.deepEqual(logger.info.args, []);
        assert.deepEqual(logger.error.args, []);
      })
      .then(() => done())
      .catch(done);
  });

  describe('log', () => {
    test('should work', done => {
      initLogService({
        debug,
        logger,
      })
        .then(log => {
          debug.reset();
          log('debug', 'debug test');
          log('stack', 'stack test');
          log('info', 'info test');
          log('error', 'error test');
          assert.deepEqual(debug.args, [['debug test'], ['stack test']]);
          assert.deepEqual(logger.info.args, [['info test']]);
          assert.deepEqual(logger.error.args, [['error test']]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', done => {
    new Knifecycle()
      .register(initLogService)
      .constant('debug', debug)
      .constant('logger', logger)
      .run(['log'])
      .then(({ log }) => {
        debug.reset();
        log('debug', 'debug test');
        log('info', 'info test');
        assert.deepEqual(debug.args, [['debug test']]);
        assert.deepEqual(logger.info.args, [['info test']]);
      })
      .then(() => done())
      .catch(done);
  });
});
