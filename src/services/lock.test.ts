import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initLockService from './lock.js';
import initDelayService from './delay.js';
import { YError } from 'yerror';
import type { DelayService } from './delay.js';
import type { LogService } from './log.js';

describe('initLockService', () => {
  const log = jest.fn<LogService>();
  const delay = {
    create: jest.fn<DelayService['create']>(),
    clear: jest.fn<DelayService['clear']>(),
  };

  beforeEach(() => {
    log.mockReset();
    delay.create.mockReset();
    delay.clear.mockReset();
  });

  test('should work', async () => {
    const testDelay = await initDelayService({});
    const lock = await initLockService<string>({
      log,
      delay,
    });

    expect(typeof lock).toEqual('object');
    expect(log.mock.calls).toMatchInlineSnapshot(`
      [
        [
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
      [
        [
          "debug",
          "🔐 - Demanding the lock on "key" (queue length was 0)",
        ],
        [
          "debug",
          "🔐 - Obtaining the lock on "key" (queue length was 0)",
        ],
        [
          "debug",
          "🔐 - Demanding the lock on "key2" (queue length was 0)",
        ],
        [
          "debug",
          "🔐 - Obtaining the lock on "key2" (queue length was 0)",
        ],
        [
          "debug",
          "🔓 - Releasing the lock on "key" (queue length was 1)",
        ],
        [
          "debug",
          "🔓 - Releasing the lock on "key2" (queue length was 1)",
        ],
      ]
    `);
    log.mockClear();

    const lockOrder: number[] = [];
    const releaseOrder: number[] = [];

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
      {
        "lockOrder": [
          1,
          2,
          3,
          4,
        ],
        "logCalls": [
          [
            "debug",
            "🔐 - Demanding the lock on "key" (queue length was 0)",
          ],
          [
            "debug",
            "🔐 - Obtaining the lock on "key" (queue length was 0)",
          ],
          [
            "debug",
            "🔐 - Demanding the lock on "key" (queue length was 1)",
          ],
          [
            "debug",
            "🔐 - Waiting the lock on "key" (queue length was 1)",
          ],
          [
            "debug",
            "🔐 - Demanding the lock on "key" (queue length was 2)",
          ],
          [
            "debug",
            "🔐 - Waiting the lock on "key" (queue length was 2)",
          ],
          [
            "debug",
            "🔐 - Demanding the lock on "key" (queue length was 3)",
          ],
          [
            "debug",
            "🔐 - Waiting the lock on "key" (queue length was 3)",
          ],
          [
            "debug",
            "🔓 - Releasing the lock on "key" (queue length was 4)",
          ],
          [
            "debug",
            "🔐 - Obtaining the lock on "key" (queue length was 1)",
          ],
          [
            "debug",
            "🔓 - Releasing the lock on "key" (queue length was 3)",
          ],
          [
            "debug",
            "🔐 - Obtaining the lock on "key" (queue length was 2)",
          ],
          [
            "debug",
            "🔓 - Releasing the lock on "key" (queue length was 2)",
          ],
          [
            "debug",
            "🔐 - Obtaining the lock on "key" (queue length was 3)",
          ],
          [
            "debug",
            "🔓 - Releasing the lock on "key" (queue length was 1)",
          ],
        ],
        "releaseOrder": [
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
        code: (err as YError).code,
        params: (err as YError).params,
      }).toMatchInlineSnapshot(`
        {
          "code": "E_NO_LOCK",
          "params": [
            "key",
          ],
        }
      `);
      expect(log.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "debug",
            "🔒 - Lock service initialized.",
          ],
        ]
      `);
    }
  });

  test('should work with Knifecycle', async () => {
    const { lock } = await new Knifecycle()
      .register(initLockService)
      .register(constant('log', log))
      .register(constant('delay', delay))
      .run(['lock']);

    expect(lock).toBeTruthy();
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🔒 - Lock service initialized.",
            ],
          ]
        `);
  });
});
