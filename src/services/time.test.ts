import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initTimeService from './time.js';
import type { LogService } from './log.js';

describe('initTimeService', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const time = await initTimeService({
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
      const time = await initTimeService({
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
      .register(initTimeService)
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
