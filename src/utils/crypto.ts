import { randomBytes as _randomBytes } from 'node:crypto';
import { YError } from 'yerror';

export async function randomBytes(length: number): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    _randomBytes(length, (err, bytes) => {
      if (err) {
        reject(YError.wrap(err as Error, 'E_RANDOM_BYTES_FAILURE', [length]));
        return;
      }
      resolve(bytes);
    });
  });
}
