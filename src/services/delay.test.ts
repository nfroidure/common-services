/* eslint max-nested-callbacks:0 */
import {
  describe,
  afterEach,
  beforeEach,
  test,
  expect,
  jest,
} from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initDelayService from './delay.js';
import type { LogService } from './log.js';

describe('initDelayService', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const delay = await initDelayService({
      log,
    });

    expect('function' === typeof delay.service.create);
    expect('function' === typeof delay.service.clear);
    expect('function' === typeof delay.dispose);
    expect(log.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "debug",
          "⌛ - Delay service initialized.",
        ],
      ]
    `);
  });

  describe('delay.create', () => {
    let setTimeoutStub;

    beforeEach(() => {
      setTimeoutStub = jest.spyOn(global, 'setTimeout');
    });

    afterEach(() => {
      setTimeoutStub.mockClear();
    });

    test('should work', async () => {
      const { service: delay } = await initDelayService({
        log,
      });

      log.mockReset();

      const delayPromise = delay.create(1000);

      expect(setTimeoutStub.mock.calls.length).toEqual(1);
      expect(setTimeoutStub.mock.calls[0][1]).toEqual(1000);
      expect(log.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "debug",
            "⏳ - Created a delay:",
            1000,
          ],
        ]
      `);
      // Run set callback
      setTimeoutStub.mock.calls[0][0]();

      await delayPromise;
    });
  });

  describe('delay.clear', () => {
    let setTimeoutStub;
    let clearTimeoutStub;

    beforeEach(() => {
      setTimeoutStub = jest.spyOn(global, 'setTimeout');
      clearTimeoutStub = jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      setTimeoutStub.mockClear();
      clearTimeoutStub.mockClear();
    });

    test('should fail with bad promise', async () => {
      const { service: delay } = await initDelayService({
        log,
      });

      log.mockReset();

      await delay.clear(Promise.resolve()).catch((err) => {
        expect(err.code).toEqual('E_BAD_DELAY');
      });
    });

    test('should work', async () => {
      const { service: delay } = await initDelayService({
        log,
      });
      const delayPromise = delay.create(10000);

      await Promise.resolve();

      log.mockReset();

      await Promise.all([
        delay.clear(delayPromise),
        delayPromise.catch((err) => {
          expect(err.code).toEqual('E_DELAY_CLEARED');
        }),
      ]);
      expect(log.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "debug",
            "⏳ - Cleared a delay",
          ],
        ]
      `);
    });
  });

  test('should work with Knifecycle', async () => {
    const { delay } = await new Knifecycle()
      .register(initDelayService)
      .register(constant('log', log))
      .run(['delay']);

    expect(delay);
    expect(log.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "debug",
          "⌛ - Delay service initialized.",
        ],
      ]
    `);
  });
});
