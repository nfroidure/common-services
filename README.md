[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:start/end` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# common-services
> A module to gather very common services and their mocks.

[![Build status](https://secure.travis-ci.org/nfroidure/common-services.svg)](https://travis-ci.org/nfroidure/common-services)
[![Coverage Status](https://coveralls.io/repos/nfroidure/common-services/badge.svg?branch=master)](https://coveralls.io/r/nfroidure/common-services?branch=master)
[![NPM version](https://badge.fury.io/js/common-services.svg)](https://npmjs.org/package/common-services)
[![Dependency Status](https://david-dm.org/nfroidure/common-services.svg)](https://david-dm.org/nfroidure/common-services)
[![devDependency Status](https://david-dm.org/nfroidure/common-services/dev-status.svg)](https://david-dm.org/nfroidure/common-services#info=devDependencies)
[![Dependency Status](https://dependencyci.com/github/nfroidure/common-services/badge)](https://dependencyci.com/github/nfroidure/common-services)
[![Package Quality](http://npm.packagequality.com/shield/common-services.svg)](http://packagequality.com/#?package=common-services)
[![Code Climate](https://codeclimate.com/github/nfroidure/common-services.svg)](https://codeclimate.com/github/nfroidure/common-services)


[//]: # (::contents:start)

This module contains various common injectable
 services I use into a lot of applications.

[//]: # (::contents:end)

# API
## Functions

<dl>
<dt><a href="#initCodeGeneratorService">initCodeGeneratorService(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code> | <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the codeGenerator service</p>
</dd>
<dt><a href="#initCounterService">initCounterService(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the counter service</p>
</dd>
<dt><a href="#initDelayService">initDelayService(services)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the delay service</p>
</dd>
<dt><a href="#initDelayMock">initDelayMock()</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the delay service mock</p>
</dd>
<dt><a href="#initLockService">initLockService(services)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the lock service</p>
</dd>
<dt><a href="#initLogService">initLogService(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the logging service</p>
</dd>
<dt><a href="#initLogMock">initLogMock()</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the logging mock</p>
</dd>
<dt><a href="#initRandomService">initRandomService(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the random service</p>
</dd>
<dt><a href="#initRandomMock">initRandomMock()</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the random service mock</p>
</dd>
<dt><a href="#initTimeService">initTimeService(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the time service</p>
</dd>
<dt><a href="#initTimeMock">initTimeMock()</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the time service mock</p>
</dd>
</dl>

<a name="initCodeGeneratorService"></a>

## initCodeGeneratorService(services) ⇒ <code>Promise.&lt;function()&gt;</code> \| <code>Promise.&lt;function()&gt;</code>
Instantiate the codeGenerator service

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.CHARS_SET] | <code>Object</code> | <code>EXPLICIT_CHARS</code> | An optional char set to pick cars into |
| [services.random] | <code>Object</code> | <code>Math.random</code> | An optional random function to replace the `Math.random` one used by default |
| [services.log] | <code>Object</code> | <code>noop</code> | An optional logging function |

**Example**  
```js
import initCodeGeneratorService from 'common-services/dist/codeGenerator';

const codeGenerator = await initCodeGeneratorService({
  log: console.log.bind(console),
});
```
<a name="initCodeGeneratorService..codeGenerator"></a>

### initCodeGeneratorService~codeGenerator([length]) ⇒ <code>Promise.&lt;String&gt;</code>
Returns a random code

**Kind**: inner method of [<code>initCodeGeneratorService</code>](#initCodeGeneratorService)  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise of the generated code  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>Number</code> | <code>6</code> | An optional custon code length (defaults to 6) |

**Example**  
```js
console.log([
  codeGenerator(),
  codeGenerator(),
  codeGenerator(),
]);
// Prints: ABCDEF,GHJKMN,PRSTUV
```
<a name="initCounterService"></a>

## initCounterService(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the counter service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the counter function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.COUNTER] | <code>Object</code> | <code>DEFAULT_COUNTER</code> | An optional configuration object |
| [services.log] | <code>Object</code> | <code>noop</code> | An optional logging function |

**Example**  
```js
import initCounterService from 'common-services/dist/counter';

const counter = await initCounterService({
  COUNTER: { firstCount: 1 },
  log: console.log.bind(console),
});
```
<a name="initCounterService..counter"></a>

### initCounterService~counter() ⇒ <code>Promise.&lt;number&gt;</code>
Returns the current count and increment the counter

**Kind**: inner method of [<code>initCounterService</code>](#initCounterService)  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise of the current count  
**Example**  
```js
console.log([
  counter(),
  counter(),
  counter(),
]);
// Prints: 1,2,3
```
<a name="initDelayService"></a>

## initDelayService(services) ⇒ <code>Promise.&lt;Object&gt;</code>
Instantiate the delay service

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise of the delay service  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>function</code> | <code>noop</code> | A logging function |

**Example**  
```js
import initDelayService from 'common-services/dist/delay';

const delay = await initDelayService({
  log: console.log.bind(console)
});
```

* [initDelayService(services)](#initDelayService) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~create(delay)](#initDelayService..create) ⇒ <code>Promise</code>
    * [~clear(promise)](#initDelayService..clear) ⇒ <code>Promise</code>

<a name="initDelayService..create"></a>

### initDelayService~create(delay) ⇒ <code>Promise</code>
Create a new delay

**Kind**: inner method of [<code>initDelayService</code>](#initDelayService)  
**Returns**: <code>Promise</code> - A promise to be resolved after that delay
or rejected if it is cancelled.  

| Param | Type | Description |
| --- | --- | --- |
| delay | <code>Number</code> | The delay in ms |

**Example**  
```js
await delay.create(1000);
console.log('1000 ms elapsed!');
```
<a name="initDelayService..clear"></a>

### initDelayService~clear(promise) ⇒ <code>Promise</code>
Cancel an earlier created delay

**Kind**: inner method of [<code>initDelayService</code>](#initDelayService)  
**Returns**: <code>Promise</code> - A promise resolved when cancellation is done.  

| Param | Type | Description |
| --- | --- | --- |
| promise | <code>Promise</code> | The promise of the delay to cancel |

**Example**  
```js
try {
  const delayPromise = delay.create(1000);
  await Promise.all(delayPromise, delay.clear(delayPromise));
  console.log('1000 ms elapsed!');
} catch (err) {
  if(err.code != 'E_DELAY_CLEARED') {
    trow err;
  }
  console.log('Cancelled!'));
}
// Prints: Cancelled!
```
<a name="initDelayMock"></a>

## initDelayMock() ⇒ <code>Promise.&lt;Object&gt;</code>
Instantiate the delay service mock

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise of the mocked delay service  
**Example**  
```js
import initDelayMock from 'common-services/dist/delay.mock';
import assert from 'assert';

const delay = await initDelayMock();

const delayPromise = delay.create(1000);

delay.resolve(delayPromise);

delayPromise.then(() => {
  // Any code here will execute immediatly
  // instead of after a 1000ms delay
});
```
<a name="initLockService"></a>

## initLockService(services) ⇒ <code>Promise.&lt;Object&gt;</code>
Instantiate the lock service

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise of the lock service  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.LOCKS_MAP] | <code>Map</code> |  | A map to store le current locks (optional) |
| [services.LOCK_TIMEOUT] | <code>Number</code> | <code>Infitiny</code> | The timeout in milliseconds for the lock to  be released. |
| [services.log] | <code>function</code> |  | A logging function |
| [services.delay] | <code>Object</code> |  | A delay service like the `common-services` one |

**Example**  
```js
import initLog from 'common-services/dist/log';
import initDelayService from 'common-services/dist/delay';
import initLock from 'common-services/dist/lock';
import ms from 'ms';

const log = await initLogService({
  logger: require('winston'),
  debug: require('debug')('myapp'),
});
const delay = await initDelayService({ log });
const lock = await initLock({ LOCK_TIMEOUT: ms('5s'), delay, log });


run();

async function run() {
  // The following async jobs are done sequentially
  // if they have the same `resourceKey` value
  await Promise.all(asynTasks.map(async (asyncTask) => {
    await lock.take(asyncTask.resourceKey);

    await myAsyncStuff1(asyncTask);
    await myAsyncStuff2(asyncTask);
    await myAsyncStuff3(asyncTask);

   lock.release(asyncTask.resourceKey);
  });
}
```

* [initLockService(services)](#initLockService) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~take(key)](#initLockService..take) ⇒ <code>Promise</code>
    * [~release(key)](#initLockService..release) ⇒ <code>void</code>

<a name="initLockService..take"></a>

### initLockService~take(key) ⇒ <code>Promise</code>
Take the lock on the given resource key

**Kind**: inner method of [<code>initLockService</code>](#initLockService)  
**Returns**: <code>Promise</code> - A promise to be resolved when the lock
 is gained or rejected if the lock release
 timeout is reached.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | A unique key for the locked resource |

<a name="initLockService..release"></a>

### initLockService~release(key) ⇒ <code>void</code>
Release the lock on the given resource key

**Kind**: inner method of [<code>initLockService</code>](#initLockService)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | A unique key for the resource to release |

<a name="initLogService"></a>

## initLogService(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the logging service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the logging function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.logger] | <code>Object</code> | <code>DEFAULT_LOGGER</code> | The logger to use |
| [services.debug] | <code>function</code> | <code>noop</code> | A debugging function |

**Example**  
```js
import initLogService from 'common-services/dist/log';

const log = await initLogService({
  logger: require('winston'),
  debug: require('debug')('myapp'),
 });
```
<a name="initLogService..log"></a>

### initLogService~log(type, ...args) ⇒ <code>void</code>
Logging function

**Kind**: inner method of [<code>initLogService</code>](#initLogService)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Log type |
| ...args | <code>\*</code> | Log contents |

**Example**  
```js
log('debug', 'Luke, I am your father!')
```
<a name="initLogMock"></a>

## initLogMock() ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the logging mock

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the mocked
 logging function  
**Example**  
```js
import initLogMock from 'common-services/dist/log.mock';
import assert from 'assert';

const log = await initLogMock();

log('info', 'Hello!');
log('error', 'Aouch!');

assert.deepEqual(log.args, [[
  'info', 'Hello!'
], [
  'error', 'Aouch!'
]]);

log.reset();

assert.deepEqual(log.args, []);
```
<a name="initRandomService"></a>

## initRandomService(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the random service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the random function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>Object</code> | <code>noop</code> | A logging function |

**Example**  
```js
import initRandomService from 'common-services/dist/random';

const random = await initRandomService({
  log: console.log.bind(console),
});
```
<a name="initRandomService..random"></a>

### initRandomService~random() ⇒ <code>number</code>
Returns a new random number

**Kind**: inner method of [<code>initRandomService</code>](#initRandomService)  
**Returns**: <code>number</code> - The random number  
**Example**  
```js
random()
// Prints: 0.3141592653589793
```
<a name="initRandomMock"></a>

## initRandomMock() ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the random service mock

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the mocked
 random function  
**Example**  
```js
import initRandomMock from 'common-services/dist/random.mock';
import assert from 'assert';

const random = await initRandomMock();

random.returns(0.5); // A good limit value to test ;)

assert.equal(random(), 0.5);
assert.deepEqual(random.args, [[]], 'Called once');

random.reset();

assert.deepEqual(random.args, []);
```
<a name="initTimeService"></a>

## initTimeService(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the time service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the time function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>Object</code> | <code>noop</code> | A logging function |

**Example**  
```js
import initTimeService from 'common-services/dist/time';

const time = await initTimeService({
  log: console.log.bind(console),
});
```
<a name="initTimeService..time"></a>

### initTimeService~time() ⇒ <code>number</code>
Returns the current timestamp

**Kind**: inner method of [<code>initTimeService</code>](#initTimeService)  
**Returns**: <code>number</code> - The current timestamp  
**Example**  
```js
time()
// Prints: 1326585600000
```
<a name="initTimeMock"></a>

## initTimeMock() ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the time service mock

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the mocked
 time function  
**Example**  
```js
import initTimeMock from 'common-services/dist/time.mock';
import assert from 'assert';

const time = await initTimeMock();

// Let's returns Thomas birth date (OMG ya father
// talking me about its childrens :D).
time.returns(new Date('2014-01-26T00:00:00.000Z'));

assert.equal(time(), 1390694400000);
assert.deepEqual(time.args, [[]], 'Called once');

time.reset();

assert.deepEqual(time.args, []);
```

# Authors
- [Nicolas Froidure](http://insertafter.com/en/index.html)

# License
[MIT](https://github.com/nfroidure/common-services/blob/master/LICENSE)
