import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initRandomBytes from './randomBytes.js';
import { type LogService } from './log.js';

describe('initRandomBytes', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const randomBytes = await initRandomBytes({
      log,
    });

    expect('function' === typeof randomBytes).toBeTruthy();
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🎲 - Random bytes service initialized.",
            ],
          ]
        `);
  });

  describe('randomBytes', () => {
    test('should work', async () => {
      const randomBytes = await initRandomBytes({
        log,
      });

      log.mockClear();

      expect(await randomBytes(16)).toHaveLength(16);

      expect(log.mock.calls).toEqual([
        ['debug', '🎲 - Created random bytes (length: 16).'],
      ]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { randomBytes } = await new Knifecycle()
      .register(initRandomBytes)
      .register(constant('log', log))
      .run(['randomBytes']);

    expect(randomBytes).toBeDefined();
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🎲 - Random bytes service initialized.",
            ],
          ]
        `);
  });
});
