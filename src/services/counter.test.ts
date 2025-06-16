import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initCounter from './counter.js';
import { type LogService } from './log.js';

describe('initCounter', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const counter = await initCounter({
      log,
    });

    expect('function' === typeof counter);
    expect(log.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "debug",
          "📇 - Counter service initialized.",
        ],
      ]
    `);
  });

  describe('counter', () => {
    test('should work', async () => {
      const counter = await initCounter({
        log,
      });

      log.mockReset();

      const num = await counter();

      expect(log.mock.calls).toEqual([['debug', '📇 - Picked a count:', num]]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { counter } = await new Knifecycle()
      .register(initCounter)
      .register(constant('log', log))
      .run(['counter']);

    expect(counter).toBeDefined();
    expect(log.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "debug",
          "📇 - Counter service initialized.",
        ],
      ]
    `);
  });
});
