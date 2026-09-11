import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { Knifecycle, constant } from 'knifecycle';
import initResolve, { type ResolveService } from './resolve.js';
import { type LogService } from './log.js';
import { type JsonValue } from 'type-fest';

describe('initResolve', () => {
  const MAIN_FILE_URL = import.meta.url;
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work', async () => {
    const resolve = await initResolve({
      MAIN_FILE_URL,
      log,
    });

    expect('function' === typeof resolve).toBeTruthy();
    expect(filterLogs(log.mock.calls)).toMatchInlineSnapshot(`
[
  [
    "debug",
    "🛂 - Initializing the resolve service (resolving from file://.../src/services/resolve.test.ts)!",
  ],
]
`);
  });

  describe('resolve', () => {
    test('should resolve relative paths before delegating', async () => {
      const importMetaResolve = jest.fn<ResolveService>(() => 'file:///tmp/test');

      const resolve = await initResolve({
        MAIN_FILE_URL,
        log,
        importMetaResolve,
      });

      log.mockClear();

      const result = resolve('./services/random.js');

      expect(result).toBe('file:///tmp/test');
      expect(importMetaResolve).toHaveBeenCalledWith(
        new URL('./services/random.js', MAIN_FILE_URL).toString(),
      );
      expect(filterLogs(log.mock.calls)).toEqual([
        ['debug', '🛂 - Resolving "./services/random.js" to "file:///tmp/test".'],
      ]);
    });

    test('should resolve absolute module identifiers as-is', async () => {
      const importMetaResolve = jest.fn<ResolveService>(() => 'node:fs');

      const resolve = await initResolve({
        MAIN_FILE_URL,
        log,
        importMetaResolve,
      });

      log.mockClear();

      const result = resolve('node:fs');

      expect(result).toBe('node:fs');
      expect(importMetaResolve).toHaveBeenCalledWith('node:fs');
      expect(filterLogs(log.mock.calls)).toEqual([
        ['debug', '🛂 - Resolving "node:fs" to "node:fs".'],
      ]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { resolve } = await new Knifecycle()
      .register(initResolve)
      .register(constant('log', log))
      .register(constant('MAIN_FILE_URL', import.meta.url))
      .run(['resolve']);

    expect(resolve).toBeDefined();
    expect(filterLogs(log.mock.calls)).toMatchInlineSnapshot(`
[
  [
    "debug",
    "🛂 - Initializing the resolve service (resolving from file://.../src/services/resolve.test.ts)!",
  ],
]
`);
  });
});

function filterLogs(calls: JsonValue[][]) {
  return calls.map((args) =>
    args.map((s) =>
      s
        ?.toString()
        .replace(/"file:\/\/.*\/common-services\/(.+)"/g, 'file://.../$1'),
    ),
  );
}
