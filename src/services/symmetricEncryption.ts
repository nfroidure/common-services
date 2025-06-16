import { noop } from '../utils/utils.js';
import { type LogService } from './log.js';
import { autoService, location } from 'knifecycle';
import { createCipheriv, createDecipheriv, getCiphers } from 'node:crypto';
import { YError } from 'yerror';

export const DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME =
  'SYMMETRIC_ENCRYPTION_SECRET' as const;
export const DEFAULT_SYMMETRIC_ENCRYPTION_OPTIONS = {
  algorithm: 'aes-256-cbc',
  ivEncoding: 'hex',
  secretEncoding: 'hex',
} as const satisfies SymmetricEncryptionOptions;

export type SymmetricEncryptionEnvVars<
  T extends string = typeof DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME,
> = Partial<Record<T, string>>;

export type SymmetricEncryptionOptions = {
  algorithm: string;
  secretEncoding: 'hex' | 'base64';
  ivEncoding: 'hex' | 'base64';
};
export type SymmetricEncryptionConfig<
  T extends string = typeof DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME,
> = {
  SYMMETRIC_ENCRYPTION_OPTIONS?: SymmetricEncryptionOptions;
  SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME?: T;
};
export type SymmetricEncryptionDependencies<
  T extends string = typeof DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME,
> = SymmetricEncryptionConfig<T> & {
  ENV: SymmetricEncryptionEnvVars<T>;
  log?: LogService;
};
export type SymmetricEncryptionService = {
  encrypt: (encodedIV: string, data: string) => Promise<string>;
  decrypt: (encodedIV: string, token: string) => Promise<string>;
};

async function initSymmetricEncryption<
  T extends string = typeof DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME,
>({
  ENV,
  SYMMETRIC_ENCRYPTION_OPTIONS = DEFAULT_SYMMETRIC_ENCRYPTION_OPTIONS,
  SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME = DEFAULT_SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME as T,
  log = noop,
}: SymmetricEncryptionDependencies<T>): Promise<SymmetricEncryptionService> {
  let symmetricEncryptionSecret: Buffer<ArrayBuffer>;

  log('warning', '🔐 - Initializing the symmetric encryption service!');

  if (!getCiphers().includes(SYMMETRIC_ENCRYPTION_OPTIONS.algorithm)) {
    log(
      'error',
      `💥 - Unavailable encryption algorithm (${SYMMETRIC_ENCRYPTION_OPTIONS.algorithm})!`,
    );
    throw new YError('E_BAD_CIPHER', SYMMETRIC_ENCRYPTION_OPTIONS.algorithm);
  }

  if (
    !ENV ||
    !(SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME in ENV) ||
    typeof ENV[SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME] !== 'string' ||
    !ENV[SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME]
  ) {
    log(
      'error',
      `💥 - The encryption secret must be set in the process environment (${SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME})!`,
    );
    throw new YError('E_NO_SYMMETRIC_ENCRYPTION_SECRET');
  }

  try {
    symmetricEncryptionSecret = Buffer.from(
      ENV[SYMMETRIC_ENCRYPTION_SECRET_ENV_NAME],
      SYMMETRIC_ENCRYPTION_OPTIONS.secretEncoding,
    );
  } catch (err) {
    throw YError.wrap(err as Error, 'E_BAD_SYMMETRIC_ENCRYPTION_SECRET');
  }

  return {
    encrypt: async (encodedIV, data) => {
      const iv = Buffer.from(encodedIV, 'hex');
      const cipher = createCipheriv(
        SYMMETRIC_ENCRYPTION_OPTIONS.algorithm,
        symmetricEncryptionSecret,
        iv,
      );
      const encrypted = cipher.update(data, 'utf8');

      return Buffer.concat([encrypted, cipher.final()]).toString('hex');
    },
    decrypt: async (encodedIV, data) => {
      const iv = Buffer.from(encodedIV, 'hex');
      const decipher = createDecipheriv(
        SYMMETRIC_ENCRYPTION_OPTIONS.algorithm,
        symmetricEncryptionSecret,
        iv,
      );
      const decrypted = decipher.update(Buffer.from(data, 'hex'));

      return Buffer.concat([decrypted, decipher.final()]).toString();
    },
  };
}

/* Architecture Note #1.11: SymmetricEncryption

A simple, easy configurable symmetric encryption service.
*/
export default location(autoService(initSymmetricEncryption), import.meta.url);
