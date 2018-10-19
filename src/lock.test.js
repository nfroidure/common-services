import assert from 'assert';
import sinon from 'sinon';
import Knifecycle, { constant } from 'knifecycle';
import initLockService from './lock';

describe('initLockService', () => {
  const log = sinon.stub();
  const delay = {
    create: sinon.stub(),
  };

  beforeEach(() => {
    log.reset();
  });

  test('should work', async () => {
    const lock = await initLockService({
      log,
      delay,
    });

    assert('object' === typeof lock);
    assert.deepEqual(log.args, [['debug', 'Lock service initialized.']]);

    await lock.take('key');
    await lock.take('key2');
    lock.release('key');
    lock.release('key2');

    await Promise.all([
      lock.take('key').then(() => lock.release('key')),
      lock.take('key').then(() => lock.release('key')),
      lock.take('key').then(() => lock.release('key')),
      lock.take('key').then(() => lock.release('key')),
    ]);
  });

  test('should work with Knifecycle', done => {
    new Knifecycle()
      .register(initLockService)
      .register(constant('log', log))
      .register(constant('delay', delay))
      .run(['lock'])
      .then(({ lock }) => {
        assert(lock);
        assert.deepEqual(log.args, [['debug', 'Lock service initialized.']]);
      })
      .then(() => done())
      .catch(done);
  });
});
