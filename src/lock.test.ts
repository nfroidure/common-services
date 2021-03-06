import Knifecycle, { constant } from 'knifecycle';
import initLockService from './lock';
import initDelayService from './delay';
import YError from 'yerror';

describe('initLockService', () => {
  const log = jest.fn();
  const delay = {
    create: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    log.mockReset();
    delay.create.mockReset();
    delay.clear.mockReset();
  });

  test('should work', async () => {
    const testDelay = await initDelayService({});
    const lock = await initLockService({
      log,
      delay,
    });

    expect(typeof lock).toEqual('object');
    expect(log.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "debug",
          "🔒 - Lock service initialized.",
        ],
      ]
    `);
    log.mockClear();

    await lock.take('key');
    await lock.take('key2');
    lock.release('key');
    lock.release('key2');

    expect(log.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "debug",
          "🔐 - Taking the lock on \\"key\\" (queue length was 0)",
        ],
        Array [
          "debug",
          "🔐 - Taking the lock on \\"key2\\" (queue length was 0)",
        ],
        Array [
          "debug",
          "🔓 - Releasing the lock on \\"key\\" (queue length was 1)",
        ],
        Array [
          "debug",
          "🔓 - Releasing the lock on \\"key2\\" (queue length was 1)",
        ],
      ]
    `);
    log.mockClear();

    const lockOrder = [];
    const releaseOrder = [];

    await Promise.all([
      lock
        .take('key')
        .then(() => (lockOrder.push(1), testDelay.service.create(10)))
        .then(() => lock.release('key'))
        .then(() => releaseOrder.push(1)),
      lock
        .take('key')
        .then(() => (lockOrder.push(2), testDelay.service.create(10)))
        .then(() => lock.release('key'))
        .then(() => releaseOrder.push(2)),
      lock
        .take('key')
        .then(() => (lockOrder.push(3), testDelay.service.create(10)))
        .then(() => lock.release('key'))
        .then(() => releaseOrder.push(3)),
      lock
        .take('key')
        .then(() => (lockOrder.push(4), testDelay.service.create(10)))
        .then(() => lock.release('key'))
        .then(() => releaseOrder.push(4)),
    ]);

    expect({
      releaseOrder,
      lockOrder,
      logCalls: log.mock.calls,
    }).toMatchInlineSnapshot(`
      Object {
        "lockOrder": Array [
          1,
          2,
          3,
          4,
        ],
        "logCalls": Array [
          Array [
            "debug",
            "🔐 - Taking the lock on \\"key\\" (queue length was 0)",
          ],
          Array [
            "debug",
            "🔐 - Taking the lock on \\"key\\" (queue length was 1)",
          ],
          Array [
            "debug",
            "🔐 - Taking the lock on \\"key\\" (queue length was 2)",
          ],
          Array [
            "debug",
            "🔐 - Taking the lock on \\"key\\" (queue length was 3)",
          ],
          Array [
            "debug",
            "🔓 - Releasing the lock on \\"key\\" (queue length was 4)",
          ],
          Array [
            "debug",
            "🔓 - Releasing the lock on \\"key\\" (queue length was 3)",
          ],
          Array [
            "debug",
            "🔓 - Releasing the lock on \\"key\\" (queue length was 2)",
          ],
          Array [
            "debug",
            "🔓 - Releasing the lock on \\"key\\" (queue length was 1)",
          ],
        ],
        "releaseOrder": Array [
          1,
          2,
          3,
          4,
        ],
      }
    `);
  });

  test('should fail when no lock', async () => {
    const lock = await initLockService({
      log,
      delay,
    });

    try {
      await lock.release('key');
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect({
        code: err.code,
        params: err.params,
      }).toMatchInlineSnapshot(`
        Object {
          "code": "E_NO_LOCK",
          "params": Array [
            "key",
          ],
        }
      `);
      expect(log.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "debug",
            "🔒 - Lock service initialized.",
          ],
        ]
      `);
    }
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initLockService)
      .register(constant('log', log))
      .register(constant('delay', delay))
      .run(['lock'])
      .then(({ lock }) => {
        expect(lock).toBeTruthy();
        expect(log.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug",
              "🔒 - Lock service initialized.",
            ],
          ]
        `);
      })
      .then(() => done())
      .catch(done);
  });
});
