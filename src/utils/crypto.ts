import { randomBytes as _randomBytes } from 'node:crypto';
import { YError } from 'yerror';

export async function randomBytes(length: number): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    _randomBytes(length, (err, salt) => {
      if (err) {
        reject(YError.wrap(err as Error, 'E_PASSWORD_RANDOM_BYTES'));
        return;
      }
      resolve(salt);
    });
  });
}
