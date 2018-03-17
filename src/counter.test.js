import assert from 'assert';
import sinon from 'sinon';
import { Knifecycle } from 'knifecycle/dist';
import initCounterService from './counter';

describe('initCounterService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  test('should work', done => {
    initCounterService({
      log,
    })
      .then(counter => {
        assert('function' === typeof counter);
        assert.deepEqual(log.args, [['debug', 'Counter service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });

  describe('counter', () => {
    test('should work', done => {
      initCounterService({
        log,
      })
        .then(counter => (log.reset(), counter()))
        .then(num => {
          assert.deepEqual(log.args, [['debug', 'Picked a count:', num]]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', done => {
    new Knifecycle()
      .register(initCounterService)
      .constant('log', log)
      .run(['counter'])
      .then(({ counter }) => {
        assert(counter);
        assert.deepEqual(log.args, [['debug', 'Counter service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });
});
