import Knifecycle, { constant } from 'knifecycle';
import initTimeService from './time';

describe('initTimeService', () => {
  const log = jest.fn();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', (done) => {
    initTimeService({
      log,
    })
      .then((time) => {
        expect('function' === typeof time);
        expect(log.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug",
              "⏰ - Time service initialized.",
            ],
          ]
        `);
      })
      .then(() => done())
      .catch(done);
  });

  describe('time', () => {
    test('should work', (done) => {
      initTimeService({
        log,
      })
        .then((time) => {
          log.mockClear();

          const now = time();

          expect(log.mock.calls).toEqual([
            ['debug', '⏰ - Picked a timestamp:', now],
          ]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initTimeService)
      .register(constant('log', log))
      .run(['time'])
      .then(({ time }) => {
        expect(time).toBeDefined();
        expect(log.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "debug",
              "⏰ - Time service initialized.",
            ],
          ]
        `);
      })
      .then(() => done())
      .catch(done);
  });
});
