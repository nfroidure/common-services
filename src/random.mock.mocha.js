'use strict';

const assert = require('assert');
const initRandomMock = require('./random.mock');

describe('initRandomMock', () => {
  it('should work', (done) => {
    initRandomMock()
    .then(fn => assert('function' === typeof fn))
    .then(() => done())
    .catch(done);
  });
});
