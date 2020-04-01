'use strict';

import assert from 'assert';
import initLogMock from './log.mock';

describe('initLogMock', () => {
  test('should work', (done) => {
    initLogMock({})
      .then((fn) => assert('function' === typeof fn))
      .then(() => done())
      .catch(done);
  });
});
