import assert from 'assert';
import initRandomMock from './random.mock';

describe('initRandomMock', () => {
  test('should work', (done) => {
    initRandomMock({})
      .then((fn) => assert('function' === typeof fn))
      .then(() => done())
      .catch(done);
  });
});
