import { describe, it } from '@jest/globals';
import { noop } from './utils.js';

describe('noop', () => {
  it('should work', () => {
    noop();
  });
});
