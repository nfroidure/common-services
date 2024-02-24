import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initRandomService from './random.js';
import type { LogService } from './log.js';

describe('initRandomService', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const random = await initRandomService({
      log,
    });

    expect('function' === typeof random);
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🎲 - Random service initialized.",
            ],
          ]
        `);
  });

  describe('random', () => {
    test('should work', async () => {
      const random = await initRandomService({
        log,
      });

      log.mockClear();

      const num = random();

      expect(log.mock.calls).toEqual([
        ['debug', '🎲 - Created a random number:', num],
      ]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { random } = await new Knifecycle()
      .register(initRandomService)
      .register(constant('log', log))
      .run(['random']);

    expect(random).toBeDefined();
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🎲 - Random service initialized.",
            ],
          ]
        `);
  });
});
