/*
 * Error registry augmentation for the `yerror` package.
 */

declare module 'yerror' {
  interface YErrorRegistry {
    /**
     * Thrown when attempting to clear a delay promise that is not managed
     * by the delay service.
     */
    E_BAD_DELAY: [];

    /**
     * Thrown when a pending delay is successfully cancelled.
     */
    E_DELAY_CLEARED: [];

    /**
     * Thrown when waiting for a lock exceeds the configured timeout.
     * @param timeout The configured timeout value in milliseconds.
     */
    E_LOCK_TIMEOUT: [timeout: number];

    /**
     * Thrown when releasing a lock for a key that does not hold any lock.
     * @param key The lock key that was missing.
     */
    E_NO_LOCK: [key: unknown];

    /**
     * Thrown when the requested symmetric cipher algorithm is unavailable.
     * @param algorithm The requested algorithm name.
     */
    E_BAD_CIPHER: [algorithm: string];

    /**
     * Thrown when the symmetric encryption secret environment variable is
     * missing or empty.
     */
    E_NO_SYMMETRIC_ENCRYPTION_SECRET: [];

    /**
     * Thrown when decoding the symmetric encryption secret fails.
     */
    E_BAD_SYMMETRIC_ENCRYPTION_SECRET: [];

    /**
     * Thrown when the configured password hash digest is not supported.
     * @param hashDigest The unsupported digest algorithm.
     */
    E_BAD_HASH_DIGEST: [hashDigest: string];

    /**
     * Thrown when password generation is requested with an unsupported
     * password encoding.
     * @param passwordEncoding The invalid password encoding.
     */
    E_BAD_PASSWORD_ENCODING: [passwordEncoding: string];

    /**
     * Thrown when PBKDF2 fails during password hashing.
     */
    E_PASSWORD_HASH: [];

    /**
     * Thrown when a dynamic import fails at runtime.
     * @param path The module path that failed to import.
     */
    E_RUNTIME_IMPORT_FAILURE: [path: string];

    /**
     * Thrown when random byte generation fails in the crypto layer.
     */
    E_PASSWORD_RANDOM_BYTES: [];
  }
}
