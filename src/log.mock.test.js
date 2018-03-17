'use strict';

const assert = require('assert');
const initLogMock = require('./log.mock');

describe('initLogMock', () => {
  test('should work', done => {
    initLogMock()
      .then(fn => assert('function' === typeof fn))
      .then(() => done())
      .catch(done);
  });
});