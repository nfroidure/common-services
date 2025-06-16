import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initTime from './time.js';
import { type LogService } from './log.js';

describe('initTime', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const time = await initTime({
      log,
    });

    expect('function' === typeof time);
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "⏰ - Time service initialized.",
            ],
          ]
        `);
  });

  describe('time', () => {
    test('should work', async () => {
      const time = await initTime({
        log,
      });

      log.mockClear();

      const now = time();

      expect(log.mock.calls).toEqual([
        ['debug', '⏰ - Picked a timestamp:', now],
      ]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { time } = await new Knifecycle()
      .register(initTime)
      .register(constant('log', log))
      .run(['time']);

    expect(time).toBeDefined();
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "⏰ - Time service initialized.",
            ],
          ]
        `);
  });
});
