import { type LogService } from 'common-services';
import { pbkdf2, getHashes } from 'node:crypto';
import { location, autoService } from 'knifecycle';
import { YError } from 'yerror';
import { randomBytes } from '../utils/crypto.js';

export type PasswordServiceOptions = {
  iterations: number;
  saltLength: number;
  saltEncoding: 'hex' | 'base64';
  hashLength: number;
  hashDigest: string;
  hashEncoding: 'hex' | 'base64';
} & (
  | {
      passwordLength: number;
      passwordEncoding: 'hex' | 'base64';
    }
  | {
      passwordEncoding: 'utf-8';
    }
);
export type PasswordServiceConfig = {
  PASSWORD_OPTIONS: PasswordServiceOptions;
};
export type PasswordServiceDependencies = Partial<PasswordServiceConfig> & {
  log: LogService;
};

export const DEFAULT_PASSWORD_OPTIONS = {
  iterations: 4096,
  passwordEncoding: 'utf-8',
  saltLength: 128,
  saltEncoding: 'base64',
  hashLength: 128,
  hashDigest: 'sha1',
  hashEncoding: 'base64',
} as const satisfies PasswordServiceOptions;

export type PasswordService = {
  generateSalt: () => Promise<string>;
  generatePassword: () => Promise<string>;
  hashPassword: (password: string, salt: string) => Promise<string>;
};

export async function initPasswordService({
  PASSWORD_OPTIONS = DEFAULT_PASSWORD_OPTIONS,
  log,
}: PasswordServiceDependencies): Promise<PasswordService> {
  log('warning', '🔐 - Initializing the password service!');

  if (!getHashes().includes(PASSWORD_OPTIONS.hashDigest)) {
    log(
      'error',
      `💥 - Unavailable password hash digest (${PASSWORD_OPTIONS.hashDigest})!`,
    );
    throw new YError('E_BAD_HASH_DIGEST', PASSWORD_OPTIONS.hashDigest);
  }

  const passwordservice: PasswordService = {
    generateSalt: async () =>
      (await randomBytes(PASSWORD_OPTIONS.saltLength)).toString(
        PASSWORD_OPTIONS.saltEncoding,
      ),
    generatePassword: async () => {
      if (PASSWORD_OPTIONS.passwordEncoding === 'utf-8') {
        log('error', `💥 - Cannot generate UTF-8 passwords!`);
        throw new YError(
          'E_BAD_PASSWORD_ENCODING',
          PASSWORD_OPTIONS.passwordEncoding,
        );
      }
      return (await randomBytes(PASSWORD_OPTIONS.passwordLength)).toString(
        PASSWORD_OPTIONS.passwordEncoding,
      );
    },
    hashPassword: (password, salt) => {
      return new Promise<string>((resolve, reject) => {
        pbkdf2(
          Buffer.from(password, PASSWORD_OPTIONS.passwordEncoding),
          Buffer.from(salt, PASSWORD_OPTIONS.saltEncoding),
          PASSWORD_OPTIONS.iterations,
          PASSWORD_OPTIONS.hashLength,
          PASSWORD_OPTIONS.hashDigest,
          (err, derivedKey) => {
            if (err) {
              reject(YError.wrap(err as Error, 'E_PASSWORD_HASH'));
              return;
            }
            resolve(derivedKey.toString(PASSWORD_OPTIONS.hashEncoding));
          },
        );
      });
    },
  };

  return passwordservice;
}

/* Architecture Note #1.12: Password

A simple, easy configurable, password management service.
*/

export default location(autoService(initPasswordService), import.meta.url);
