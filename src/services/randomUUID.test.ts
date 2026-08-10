import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initRandomUUID from './randomUUID.js';
import { type LogService } from './log.js';

describe('initRandomUUID', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const randomUUID = await initRandomUUID({
      log,
    });

    expect('function' === typeof randomUUID);
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🎲 - Random UUID service initialized.",
            ],
          ]
        `);
  });

  describe('randomUUID', () => {
    test('should work', async () => {
      const randomUUID = await initRandomUUID({
        log,
      });

      log.mockClear();

      const uuid = randomUUID();

      expect(log.mock.calls).toEqual([
        ['debug', '🎲 - Created a random UUID:', uuid],
      ]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { randomUUID } = await new Knifecycle()
      .register(initRandomUUID)
      .register(constant('log', log))
      .run(['randomUUID']);

    expect(randomUUID).toBeDefined();
    expect(log.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug",
              "🎲 - Random UUID service initialized.",
            ],
          ]
        `);
  });
});
