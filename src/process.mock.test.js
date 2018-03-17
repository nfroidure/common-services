'use strict';

const assert = require('assert');
const initProcessMock = require('./process.mock');

describe('initProcessMock', () => {
  test('should work', done => {
    initProcessMock()
      .then(service => assert('undefined' === typeof service))
      .then(() => done())
      .catch(done);
  });
});
