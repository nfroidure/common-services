'use strict';

import assert from 'assert';
import initProcessMock from './process.mock';

describe('initProcessMock', () => {
  test('should work', (done) => {
    initProcessMock({})
      .then((service) => assert('undefined' === typeof service))
      .then(() => done())
      .catch(done);
  });
});
