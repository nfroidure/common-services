import { describe, test, beforeEach, jest, expect } from '@jest/globals';
import { YError } from 'yerror';
import initImporter from './importer.js';
import { type LogService } from './log.js';

describe('initImporter', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should work with existing module', async () => {
    const importer = await initImporter({
      log,
    });

    const result = await importer('yerror');

    expect({
      result: typeof result,
      logCalls: log.mock.calls,
    }).toMatchInlineSnapshot(`
      {
        "logCalls": [
          [
            "debug",
            "🛂 - Initializing the importer!",
          ],
          [
            "debug",
            "🛂 - Dynamic import of "yerror".",
          ],
        ],
        "result": "object",
      }
    `);
  });

  test('should fail with not existing module', async () => {
    const importer = await initImporter({
      log,
    });

    try {
      await importer('@nowhere/anywhere');
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect({
        errorCode: (err as YError).code,
        errorDebug: (err as YError).debug,
        logCalls: log.mock.calls.filter(([type]) => !type.startsWith('debug-')),
      }).toMatchInlineSnapshot(`
       {
         "errorCode": "E_RUNTIME_IMPORT_FAILURE",
         "errorDebug": [
           "@nowhere/anywhere",
         ],
         "logCalls": [
           [
             "debug",
             "🛂 - Initializing the importer!",
           ],
           [
             "debug",
             "🛂 - Dynamic import of "@nowhere/anywhere".",
           ],
           [
             "debug",
             "⚠️ - Got a runtime import error for "@nowhere/anywhere" !",
           ],
         ],
       }
      `);
    }
  });
});
