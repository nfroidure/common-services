import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initResolveService from './resolve.js';
import type { LogService } from './log.js';

describe('initResolveService', () => {
  const MAIN_FILE_URL = import.meta.url;
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const resolve = await initResolveService({
      MAIN_FILE_URL,
      log,
    });

    expect('function' === typeof resolve);
    expect(filterLogs(log.mock.calls)).toMatchInlineSnapshot(`
[
  [
    "warning",
    "🛂 - Initializing the resolve service (resolving from file://.../src/services/resolve.test.ts)!",
  ],
]
`);
  });

  // TODO: enable it when Jest will fully support `import`
  describe.skip('resolve', () => {
    test('should work', async () => {
      const resolve = await initResolveService({
        MAIN_FILE_URL,
        log,
      });

      log.mockClear();

      const result = resolve('./services/random.js');

      expect({
        result,
        logCalls: filterLogs(log.mock.calls),
      }).toMatchInlineSnapshot();
    });
  });

  test('should work with Knifecycle', async () => {
    const { resolve } = await new Knifecycle()
      .register(initResolveService)
      .register(constant('log', log))
      .register(constant('MAIN_FILE_URL', import.meta.url))
      .run(['resolve']);

    expect(resolve).toBeDefined();
    expect(filterLogs(log.mock.calls)).toMatchInlineSnapshot(`
[
  [
    "warning",
    "🛂 - Initializing the resolve service (resolving from file://.../src/services/resolve.test.ts)!",
  ],
]
`);
  });
});

function filterLogs(calls) {
  return calls.map((args) =>
    args.map((s) =>
      s
        ?.toString()
        .replace(/"file:\/\/.*\/common-services\/(.+)"/g, 'file://.../$1'),
    ),
  );
}
