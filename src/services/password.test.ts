import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { type LogService } from 'common-services';

import initPassword, { DEFAULT_PASSWORD_OPTIONS } from './password.js';
import { YError } from 'yerror';

describe('initPassword', () => {
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
  });

  test('should fail without secret', async () => {
    try {
      await initPassword({
        PASSWORD_OPTIONS: {
          ...DEFAULT_PASSWORD_OPTIONS,
          hashDigest: 'would_be_surprising_a_digest_like_this_exist_someday',
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
  "errorCode": "E_BAD_HASH_DIGEST",
  "errorParams": [
    "would_be_surprising_a_digest_like_this_exist_someday",
  ],
  "logCalls": [
    [
      "warning",
      "🔐 - Initializing the password service!",
    ],
    [
      "error",
      "💥 - Unavailable password hash digest (would_be_surprising_a_digest_like_this_exist_someday)!",
    ],
  ],
}
`);
    }
  });

  describe('.generateSalt()', () => {
    test('should work', async () => {
      const password = await initPassword({ log });

      expect(await password.generateSalt()).toBeTruthy();
    });
  });

  describe('.generatePassword()', () => {
    test('should work', async () => {
      const password = await initPassword({
        PASSWORD_OPTIONS: {
          ...DEFAULT_PASSWORD_OPTIONS,
          passwordEncoding: 'base64',
          passwordLength: 128,
        },
        log,
      });

      expect(await password.generatePassword()).toBeTruthy();
    });
  });

  describe('.hashPassword()', () => {
    describe('with existing passwords', () => {
      test('should work', async () => {
        const password = await initPassword({ log });
        const salt = await password.generateSalt();

        expect(await password.hashPassword('my-password', salt)).toBeTruthy();
      });

      test('should be predictable', async () => {
        const password = await initPassword({ log });
        const salt = await password.generateSalt();
        const hash = await password.hashPassword('my-password', salt);

        expect(hash).toEqual(await password.hashPassword('my-password', salt));
      });
    });

    describe('with generated passwords', () => {
      test('should work', async () => {
        const password = await initPassword({
          PASSWORD_OPTIONS: {
            ...DEFAULT_PASSWORD_OPTIONS,
            passwordEncoding: 'base64',
            passwordLength: 128,
          },
          log,
        });
        const salt = await password.generateSalt();
        const secret = await password.generatePassword();

        expect(await password.hashPassword(secret, salt)).toBeTruthy();
      });

      test('should be predictable', async () => {
        const password = await initPassword({
          PASSWORD_OPTIONS: {
            ...DEFAULT_PASSWORD_OPTIONS,
            passwordEncoding: 'base64',
            passwordLength: 128,
          },
          log,
        });
        const salt = await password.generateSalt();
        const secret = await password.generatePassword();
        const hash = await password.hashPassword(secret, salt);

        expect(hash).toEqual(await password.hashPassword(secret, salt));
      });
    });
  });
});
