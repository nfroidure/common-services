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
import initDelay, { type DelayService } from './delay.js';
import { type LogService } from './log.js';

describe('initDelay', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const delay = await initDelay({
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
      const { service: delay } = await initDelay({
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
      const { service: delay } = await initDelay({
        log,
      });

      log.mockReset();

      await delay.clear(Promise.resolve()).catch((err) => {
        expect(err.code).toEqual('E_BAD_DELAY');
      });
    });

    test('should work', async () => {
      const { service: delay } = await initDelay({
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
    const $ = new Knifecycle();
    const { delay } = await $.register(initDelay)
      .register(constant('log', log))
      .run<{ delay: DelayService }>(['delay']);

    expect(delay);

    await $.destroy();

    expect(log.mock.calls).toMatchInlineSnapshot(`
[
  [
    "debug",
    "⌛ - Delay service initialized.",
  ],
  [
    "debug",
    "⏳ - Cancelling pending timeouts:",
    0,
  ],
]
`);
  });
});
