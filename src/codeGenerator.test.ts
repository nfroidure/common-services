import { jest } from '@jest/globals';
import initCodeGenerator from './codeGenerator.js';
import type { RandomService } from './random.js';
import type { LogService } from './log.js';

describe('codeGenerator', () => {
  const log = jest.fn<LogService>();
  const random = jest.fn<RandomService>();

  beforeEach(() => {
    log.mockReset();
    random.mockReset();
  });

  test('should work', async () => {
    random.mockReturnValueOnce(0.5);
    const codeGenerator = await initCodeGenerator({
      random,
      log,
    });
    const code = await codeGenerator();

    expect({
      code,
      logCalls: log.mock.calls,
      randomCalls: random.mock.calls,
    }).toMatchSnapshot();
  });
});
