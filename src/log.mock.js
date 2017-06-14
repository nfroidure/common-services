'use strict';

const sinon = require('sinon');
const initLogService = require('./log');
const { reuseSpecialProps } = require('knifecycle/dist/util');

/* Architecture Note #1.1.1: Mocking logs

The log mock uses the
 [`sinon`](https://github.com/sinonjs/sinon/)
 module under the hood. I inject it in my tests
 and make assertions on its given args.

For example:
```js1
import initLogMock from 'common-services/src/log.mock';
import myTestedFunction from 'mylib';

describe('my test', () => {
  let log;

  before((done) => {
    initLogMock()
    .then((_log_) => {
      log = _log_;
    })
    .then(done)
    .catch(done);
  });

  beforeEach(() => {
    log.reset();
  });

  it('should not log when no arg', () => {
    myTestedFunction();

    // Here I could use `callCount` or other `sinon`
    // helpers but the fact to always use
    // `assert.deepEqual` and the `sinon` args property
    // give immediate input on what was wrong:
    // if it had been called, we would see how many
    // times and with which args in the tests output.
    assert.deepEqual(logs.args, [], 'No log');
  });

  it('should log its args', () => {
    myTestedFunction('wadup', 'kikoo', 'lol');

    assert.deepEqual(logs.args, [[
      'info', 'wadup', 'kikoo', 'lol',
    ]], 'Logger output args');
  });

});
```
*/

module.exports = reuseSpecialProps(initLogService, initLogMock);

/**
 * Instantiate the logging mock
 * @return {Promise<Function>}  A promise of the mocked
 *  logging function
 * @example
 * import initLogMock from 'common-services/src/log.mock';
 * import assert from 'assert';
 *
 * const log = await initLogMock();
 *
 * log('info', 'Hello!');
 * log('error', 'Aouch!');
 *
 * assert.deepEqual(log.args, [[
 *   'info', 'Hello!'
 * ], [
 *   'error', 'Aouch!'
 * ]]);
 *
 * log.reset();
 *
 * assert.deepEqual(log.args, []);
 */
function initLogMock() {
  return Promise.resolve(sinon.stub());
}
