[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:(start/end)` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# common-services
> A module to gather very common services and their mocks.

[![NPM version](https://badge.fury.io/js/common-services.svg)](https://npmjs.org/package/common-services)
[![Build status](https://secure.travis-ci.org/nfroidure/common-services.svg)](https://travis-ci.org/nfroidure/common-services)
[![Dependency Status](https://david-dm.org/nfroidure/common-services.svg)](https://david-dm.org/nfroidure/common-services)
[![devDependency Status](https://david-dm.org/nfroidure/common-services/dev-status.svg)](https://david-dm.org/nfroidure/common-services#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/nfroidure/common-services/badge.svg?branch=master)](https://coveralls.io/r/nfroidure/common-services?branch=master)
[![Code Climate](https://codeclimate.com/github/nfroidure/common-services.svg)](https://codeclimate.com/github/nfroidure/common-services)
[![Dependency Status](https://dependencyci.com/github/nfroidure/common-services/badge)](https://dependencyci.com/github/nfroidure/common-services)


[//]: # (::contents:start)

This module contains various common injectable
 services I use into a lot of applications.

[//]: # (::contents:end)

# API
## Functions

<dl>
<dt><a href="#initCounterService">initCounterService(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the counter service</p>
</dd>
<dt><a href="#initDelayService">initDelayService(services)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the delay service</p>
</dd>
<dt><a href="#initDelayMock">initDelayMock()</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the delay service mock</p>
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

<a name="initCounterService"></a>

## initCounterService(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the counter service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the counter function  

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| [services.COUNTER] | <code>Object</code> | An optional configuration object |
| [services.log] | <code>Object</code> | An optional logging function |

**Example**  
```js
import initCounterService from 'common-services/src/counter';

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

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| [services.log] | <code>function</code> | A logging function |

**Example**  
```js
import initDelayService from 'common-services/src/delay';

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
delay.create(1000)
.then(() => console.log('1000 ms elapsed!'))
.catch(() => console.log('Cancelled!'));
// Prints: 1000 ms elapsed!
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
const delayed = delay.create(1000)
.then(() => console.log('1000 ms elapsed!'))
.catch(() => console.log('Cancelled!'));
clear(delayed)
// Prints: Cancelled!
```
<a name="initDelayMock"></a>

## initDelayMock() ⇒ <code>Promise.&lt;Object&gt;</code>
Instantiate the delay service mock

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise of the mocked delay service  
**Example**  
```js
import initDelayMock from 'common-services/src/delay.mock';
import assert from 'assert';

const delay = await initDelayMock();

const delayPromise = delay.create(1000);

delay.resolve(delayPromise);

delayPromise.then(() => {
  // Any code here will execute immediatly
  // instead of after a 1000ms delay
});
```
<a name="initLogService"></a>

## initLogService(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the logging service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the logging function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.logger] | <code>Object</code> |  | The logger to use |
| [services.debug] | <code>function</code> | <code>noop</code> | A debugging function |

**Example**  
```js
import initLogService from 'common-services/src/log';

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
import initLogMock from 'common-services/src/log.mock';
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

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| [services.log] | <code>Object</code> | A logging function |

**Example**  
```js
import initRandomService from 'common-services/src/random';

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
import initRandomMock from 'common-services/src/random.mock';
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

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| [services.log] | <code>Object</code> | A logging function |

**Example**  
```js
import initTimeService from 'common-services/src/time';

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
import initTimeMock from 'common-services/src/time.mock';
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

# License
[MIT](https://github.com/nfroidure/common-services/blob/master/LICENSE)
