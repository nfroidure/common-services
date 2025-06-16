import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { type LogService } from 'common-services';

import initSymmetricEncryption, {
  type SymmetricEncryptionOptions,
} from './symmetricEncryption.js';
import { YError } from 'yerror';

describe('initSymmetricEncryption', () => {
  const log = jest.fn<LogService>();
  const SYMMETRIC_ENCRYPTION_SECRET =
    '06bc76597a5e7d98a96da92415cd6b9455157c81ff972351ce4eb5e047067bdc';
  const SYMMETRIC_ENCRYPTION_OPTIONS: SymmetricEncryptionOptions = {
    algorithm: 'aes-256-cbc',
    ivEncoding: 'hex',
    secretEncoding: 'hex',
  };
  const ENCODED_IV = '5ee01b6f3fa4adbff73ecbbb43d19407';

  beforeEach(() => {
    log.mockReset();
  });

  test('should fail with no secret', async () => {
    try {
      await initSymmetricEncryption({
        ENV: { SYMMETRIC_ENCRYPTION_SECRET: '' },
        SYMMETRIC_ENCRYPTION_OPTIONS,
        log,
      });
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect({
        errorCode: (err as YError).code,
        errorParams: (err as YError).params,
        logCalls: log.mock.calls,
      }).toMatchInlineSnapshot(`
{
  "errorCode": "E_NO_SYMMETRIC_ENCRYPTION_SECRET",
  "errorParams": [],
  "logCalls": [
    [
      "warning",
      "🔐 - Initializing the symmetric encryption service!",
    ],
    [
      "error",
      "💥 - The encryption secret must be set in the process environment (SYMMETRIC_ENCRYPTION_SECRET)!",
    ],
  ],
}
`);
    }
  });

  test('should fail with a bad cipher', async () => {
    try {
      await initSymmetricEncryption({
        ENV: { SYMMETRIC_ENCRYPTION_SECRET },
        SYMMETRIC_ENCRYPTION_OPTIONS: {
          ...SYMMETRIC_ENCRYPTION_OPTIONS,
          algorithm: 'this_cipher_algorithm_should_not_exist',
        },
        log,
      });
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect({
        errorCode: (err as YError).code,
        errorParams: (err as YError).params,
        logCalls: log.mock.calls,
      }).toMatchInlineSnapshot(`
{
  "errorCode": "E_BAD_CIPHER",
  "errorParams": [
    "this_cipher_algorithm_should_not_exist",
  ],
  "logCalls": [
    [
      "warning",
      "🔐 - Initializing the symmetric encryption service!",
    ],
    [
      "error",
      "💥 - Unavailable encryption algorithm (this_cipher_algorithm_should_not_exist)!",
    ],
  ],
}
`);
    }
  });

  describe('.encrypt()', () => {
    test('should work', async () => {
      const symmetricEncryption = await initSymmetricEncryption({
        ENV: { SYMMETRIC_ENCRYPTION_SECRET },
        SYMMETRIC_ENCRYPTION_OPTIONS,
        log,
      });

      expect({
        encoded: await symmetricEncryption.encrypt(
          ENCODED_IV,
          'my-secret-data',
        ),
        logCalls: log.mock.calls,
      }).toMatchInlineSnapshot(`
{
  "encoded": "64b107e5373b313b22f92b4ad865aa86",
  "logCalls": [
    [
      "warning",
      "🔐 - Initializing the symmetric encryption service!",
    ],
  ],
}
`);
    });
  });

  describe('.decrypt()', () => {
    test('should work', async () => {
      const symmetricEncryption = await initSymmetricEncryption({
        ENV: { SYMMETRIC_ENCRYPTION_SECRET },
        SYMMETRIC_ENCRYPTION_OPTIONS,
        log,
      });

      expect({
        decoded: await symmetricEncryption.decrypt(
          ENCODED_IV,
          '64b107e5373b313b22f92b4ad865aa86',
        ),
        logCalls: log.mock.calls,
      }).toMatchInlineSnapshot(`
{
  "decoded": "my-secret-data",
  "logCalls": [
    [
      "warning",
      "🔐 - Initializing the symmetric encryption service!",
    ],
  ],
}
`);
    });
  });
});
