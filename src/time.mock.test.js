'use strict';

const assert = require('assert');
const initTimeMock = require('./time.mock');

describe('initTimeMock', () => {
  test('should work', done => {
    initTimeMock()
      .then(fn => assert('function' === typeof fn))
      .then(() => done())
      .catch(done);
  });
});
