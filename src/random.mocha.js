'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { Knifecycle } = require('knifecycle/dist');
const initRandomService = require('./random');

describe('initRandomService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  it('should work', (done) => {
    initRandomService({
      log,
    })
    .then((random) => {
      assert('function' === typeof random);
      assert.deepEqual(log.args, [[
        'debug', 'Random service initialized.',
      ]]);
    })
    .then(() => done())
    .catch(done);
  });

  describe('random', () => {
    it('should work', (done) => {
      initRandomService({
        log,
      })
      .then((random) => {
        log.reset();
        const num = random('debug', 'debug test');

        assert.deepEqual(log.args, [[
          'debug', 'Created a random number:', num,
        ]]);
      })
      .then(() => done())
      .catch(done);
    });
  });

  it('should work with Knifecycle', (done) => {
    new Knifecycle()
    .register(initRandomService)
    .constant('log', log)
    .run(['random'])
    .then(({ random }) => {
      assert.deepEqual(log.args, [[
        'debug',
        'Random service initialized.',
      ]]);
    })
    .then(() => done())
    .catch(done);
  });
});
