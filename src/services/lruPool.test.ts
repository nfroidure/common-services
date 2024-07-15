import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initLRUPoolService, { type LRUPoolManagerService } from './lruPool.js';
import { type LogService } from './log.js';
import { type DelayService } from './delay.js';

const instances = ['i1', 'i2', 'i3', 'i4'] as const;

type V = number;
type U = (typeof instances)[V];

describe('initLRUPoolService', () => {
  const MAX_POOL_SIZE = 3;
  const POOL_TTL = 30000;
  const poolManager = {
    create: jest.fn<LRUPoolManagerService<U, V>['create']>(),
    release: jest.fn<LRUPoolManagerService<U, V>['release']>(),
  };
  const delay = {
    create: jest.fn<DelayService['create']>(),
    clear: jest.fn<DelayService['clear']>(),
  };
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
    delay.create.mockReset();
    delay.clear.mockReset();
    poolManager.create.mockReset();
    poolManager.create.mockImplementation((c) => Promise.resolve(instances[c]));
    poolManager.release.mockReset();
  });

  test('should work', async () => {
    const lruPool = await initLRUPoolService({
      MAX_POOL_SIZE,
      poolManager,
      delay,
      log,
    });

    expect('function' === typeof lruPool);
    expect({
      delayCreateCalls: delay.create.mock.calls,
      delayClearCalls: delay.clear.mock.calls,
      logCalls: log.mock.calls,
    }).toMatchInlineSnapshot(`
{
  "delayClearCalls": [],
  "delayCreateCalls": [],
  "logCalls": [
    [
      "warning",
      "✅ - Initializing a LRU pool service.",
    ],
  ],
}
`);
  });

  describe('lruPool', () => {
    test('should work without ttl', async () => {
      const lruPool = await initLRUPoolService({
        MAX_POOL_SIZE,
        poolManager,
        delay,
        log,
      });

      delay.create.mockImplementation(() => new Promise(() => {}));
      log.mockClear();

      for (let i = 0; i < 6; i++) {
        const instance = await lruPool.service.use(i % instances.length);

        expect(instance).toBe(instances[i % instances.length]);
      }

      await lruPool.dispose();

      expect({
        delayCreateCalls: delay.create.mock.calls,
        delayClearCalls: delay.clear.mock.calls,
        logCalls: log.mock.calls,
      }).toMatchInlineSnapshot(`
{
  "delayClearCalls": [],
  "delayCreateCalls": [],
  "logCalls": [
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is full, releasing an item (0).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is full, releasing an item (1).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is full, releasing an item (2).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
  ],
}
`);
    });
  });

  test('should work with ttl', async () => {
    const lruPool = await initLRUPoolService({
      MAX_POOL_SIZE,
      POOL_TTL,
      poolManager,
      delay,
      log,
    });

    log.mockClear();
    delay.create.mockImplementation(() => new Promise(() => {}));

    for (let i = 0; i < 6; i++) {
      const instance = await lruPool.service.use(i % instances.length);

      expect(instance).toBe(instances[i % instances.length]);
    }

    await lruPool.dispose();

    expect({
      delayCreateCalls: delay.create.mock.calls,
      delayClearCalls: delay.clear.mock.calls,
      logCalls: log.mock.calls,
    }).toMatchInlineSnapshot(`
{
  "delayClearCalls": [
    [
      Promise {},
    ],
    [
      Promise {},
    ],
    [
      Promise {},
    ],
    [
      Promise {},
    ],
    [
      Promise {},
    ],
    [
      Promise {},
    ],
  ],
  "delayCreateCalls": [
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
  ],
  "logCalls": [
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is full, releasing an item (0).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is full, releasing an item (1).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is full, releasing an item (2).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
  ],
}
`);
  });

  test('should work with realized ttl', async () => {
    const lruPool = await initLRUPoolService({
      MAX_POOL_SIZE,
      POOL_TTL,
      poolManager,
      delay,
      log,
    });

    log.mockClear();

    for (let i = 0; i < 6; i++) {
      let resolve;
      const promise = new Promise<void>((_resolve) => {
        resolve = _resolve;
      });

      delay.create.mockReturnValueOnce(promise);

      const instance = await lruPool.service.use(i % instances.length);

      resolve();

      await promise;

      expect(instance).toBe(instances[i % instances.length]);
    }

    await lruPool.dispose();

    expect({
      delayCreateCalls: delay.create.mock.calls,
      delayClearCalls: delay.clear.mock.calls,
      logCalls: log.mock.calls,
    }).toMatchInlineSnapshot(`
{
  "delayClearCalls": [],
  "delayCreateCalls": [
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
    [
      30000,
    ],
  ],
  "logCalls": [
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is releasing an item by ttl (0).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is releasing an item by ttl (1).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is releasing an item by ttl (2).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is releasing an item by ttl (3).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is releasing an item by ttl (0).",
    ],
    [
      "debug",
      "➕ - Creating an item from the pool.",
    ],
    [
      "debug",
      "🧹 - Pool is releasing an item by ttl (1).",
    ],
  ],
}
`);
  });

  test('should work with Knifecycle', async () => {
    const { lruPool } = await new Knifecycle()
      .register(initLRUPoolService)
      .register(constant('MAX_POOL_SIZE', MAX_POOL_SIZE))
      .register(constant('POOL_TTL', POOL_TTL))
      .register(constant('delay', delay))
      .register(constant('poolManager', poolManager))
      .register(constant('log', log))
      .run(['lruPool']);

    expect(lruPool).toBeDefined();
    expect({
      delayCreateCalls: delay.create.mock.calls,
      delayClearCalls: delay.clear.mock.calls,
      logCalls: log.mock.calls,
    }).toMatchInlineSnapshot(`
{
  "delayClearCalls": [],
  "delayCreateCalls": [],
  "logCalls": [
    [
      "warning",
      "✅ - Initializing a LRU pool service.",
    ],
  ],
}
`);
  });
});
