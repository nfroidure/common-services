'use strict';

const assert = require('assert');
const initTimeMock = require('./time.mock');

describe('initTimeMock', () => {
  it('should work', (done) => {
    initTimeMock()
    .then(fn => assert('function' === typeof fn))
    .then(() => done())
    .catch(done);
  });
});
