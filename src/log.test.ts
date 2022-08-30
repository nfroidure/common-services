import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initLogService from './log.js';
import type { LogService } from './index.js';

describe('initLogService', () => {
  const logger = { output: jest.fn(), error: jest.fn(), debug: jest.fn() };

  beforeEach(() => {
    logger.output.mockReset();
    logger.error.mockReset();
    logger.debug.mockReset();
  });

  test('should work', (done) => {
    initLogService({
      logger,
    })
      .then((fn) => {
        expect('function' === typeof fn);
        expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "👣 - Logging service initialized.",
            ],
          ]
        `);
        expect(logger.output.mock.calls).toMatchInlineSnapshot(`[]`);
        expect(logger.error.mock.calls).toMatchInlineSnapshot(`[]`);
      })
      .then(() => done())
      .catch(done);
  });

  describe('log', () => {
    test('should work', (done) => {
      initLogService({
        logger,
      })
        .then((log) => {
          logger.debug.mockClear();
          log('debug', 'debug test');
          log('debug-stack', 'debug stack test');
          log('info', 'info test');
          log('error', 'error test');
          log('error-stack', 'error stack test');
          log('warning', 'warning test');
          expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
            [
              [
                "debug test",
              ],
              [
                "debug stack test",
              ],
            ]
          `);
          expect(logger.output.mock.calls).toMatchInlineSnapshot(`
            [
              [
                "info test",
              ],
            ]
          `);
          expect(logger.error.mock.calls).toMatchInlineSnapshot(`
            [
              [
                "error test",
              ],
              [
                "error stack test",
              ],
              [
                "warning test",
              ],
            ]
          `);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initLogService)
      .register(constant('logger', logger))
      .run<{ log: LogService }>(['log'])
      .then(({ log }) => {
        logger.debug.mockClear();
        log('debug', 'debug test');
        log('info', 'info test');
        expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "debug test",
            ],
          ]
        `);
        expect(logger.output.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "info test",
            ],
          ]
        `);
        expect(logger.error.mock.calls).toMatchInlineSnapshot(`[]`);
      })
      .then(() => done())
      .catch(done);
  });
});
