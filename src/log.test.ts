import Knifecycle, { constant } from 'knifecycle';
import initLogService from './log';

describe('initLogService', () => {
  const debug = jest.fn();
  const logger = {
    error: jest.fn(),
    info: jest.fn(),
  };

  beforeEach(() => {
    debug.mockReset();
    logger.info.mockReset();
    logger.error.mockReset();
  });

  test('should work', (done) => {
    initLogService({
      debug,
      logger,
    })
      .then((fn) => {
        expect('function' === typeof fn);
        expect(debug.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "👣 - Logging service initialized.",
            ],
          ]
        `);
        expect(logger.info.mock.calls).toMatchInlineSnapshot(`Array []`);
        expect(logger.error.mock.calls).toMatchInlineSnapshot(`Array []`);
      })
      .then(() => done())
      .catch(done);
  });

  describe('log', () => {
    test('should work', (done) => {
      initLogService({
        debug,
        logger,
      })
        .then((log) => {
          debug.mockClear();
          log('debug', 'debug test');
          log('stack', 'stack test');
          log('info', 'info test');
          log('error', 'error test');
          expect(debug.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "debug test",
              ],
            ]
          `);
          expect(logger.info.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "info test",
              ],
            ]
          `);
          expect(logger.error.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "stack test",
              ],
              Array [
                "error test",
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
      .register(constant('debug', debug))
      .register(constant('logger', logger))
      .run(['log'])
      .then(({ log }) => {
        debug.mockClear();
        log('debug', 'debug test');
        log('info', 'info test');
        expect(debug.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug test",
            ],
          ]
        `);
        expect(logger.info.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "info test",
            ],
          ]
        `);
        expect(logger.error.mock.calls).toMatchInlineSnapshot(`Array []`);
      })
      .then(() => done())
      .catch(done);
  });
});
