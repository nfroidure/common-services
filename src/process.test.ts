import YError from 'yerror';
import Knifecycle, { constant } from 'knifecycle';
import initProcessService from './process';

describe('Process service', () => {
  const log = jest.fn();
  const savedProcessName = global.process.title;
  const processListenerStub = jest.spyOn(global.process, 'on');
  let exit;
  let exitPromise;
  let fatalErrorDeferred;

  beforeEach(() => {
    exitPromise = new Promise((resolve) => {
      exit = jest.fn(resolve);
    });
    processListenerStub.mockClear();
    log.mockReset();
  });

  afterEach(() => {
    global.process.title = savedProcessName;
  });

  describe('', () => {
    beforeEach((done) => {
      initProcessService({
        NODE_ENV: 'development',
        PROCESS_NAME: 'Kikooolol',
        log,
        exit,
        $instance: { destroy: () => Promise.resolve() } as Knifecycle<unknown>,
        $fatalError: {
          promise: new Promise((resolve, reject) => {
            fatalErrorDeferred = { resolve, reject };
          }),
        },
      })
        .then(() => done())
        .catch(done);
    });

    test('should work', () => {
      expect(log.mock.calls).toEqual([
        ['warning', '🔂 - Running in "development" environment.'],
        ['debug', '📇 - Process service initialized.'],
      ]);
      expect(global.process.title).toEqual('Kikooolol - development');
      expect(processListenerStub.mock.calls.length).toEqual(3);
    });

    test('should handle fatal errors', (done) => {
      fatalErrorDeferred.reject(new YError('E_AOUCH'));

      exitPromise
        .then(() => {
          expect(exit.mock.calls).toEqual([[1]]);
        })
        .then(() => done())
        .catch(done);
    });

    test('should handle uncaught exceptions', (done) => {
      processListenerStub.mock.calls.find(
        (call) => 'uncaughtException' === call[0],
      )[1](new YError('E_AOUCH'));

      exitPromise
        .then(() => {
          expect(exit.mock.calls).toEqual([[1]]);
        })
        .then(() => done())
        .catch(done);
    });

    ['SIGINT', 'SIGTERM'].forEach((signal) =>
      test('should handle `signal`', (done) => {
        processListenerStub.mock.calls.find((call) => signal === call[0])[1](
          new YError('E_AOUCH'),
        );

        exitPromise
          .then(() => {
            expect(exit.mock.calls).toEqual([[0]]);
          })
          .then(() => done())
          .catch(done);
      }),
    );
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initProcessService)
      .register(constant('log', log))
      .register(constant('NODE_ENV', 'production'))
      .register(constant('exit', exit))
      .run(['process'])
      .then(() => {
        expect(log.mock.calls).toEqual([
          ['warning', '🔂 - Running in "production" environment.'],
          ['debug', '📇 - Process service initialized.'],
        ]);
      })
      .then(() => done())
      .catch(done);
  });
});
