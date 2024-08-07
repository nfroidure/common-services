[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:start/end` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# common-services
> A module to gather very common services.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nfroidure/common-services/blob/main/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/nfroidure/common-services/badge.svg?branch=main)](https://coveralls.io/github/nfroidure/common-services?branch=main)


[//]: # (::contents:start)

This module contains various common injectable services that are often used into
a wide range of applications.

The services provided here are meant to have a very tiny surface API in order to
be easily mocked but also implemented with different technologies.

For example, the `counter` service could be implemented with a distributed
architecture, the `codeGenerator` though a database...

The services are designed to be used with
[Knifecycle](https://github.com/nfroidure/knifecycle) a simple but feature
complete dependency injection tool but can also be used by hand.

[//]: # (::contents:end)

# API
## Functions

<dl>
<dt><a href="#initCodeGenerator">initCodeGenerator(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code> | <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the codeGenerator service</p>
</dd>
<dt><a href="#initCounter">initCounter(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the counter service</p>
</dd>
<dt><a href="#initDelay">initDelay(services)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the delay service</p>
</dd>
<dt><a href="#initImporter">initImporter(path)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Allow to import ES modules.</p>
</dd>
<dt><a href="#initLock">initLock(services)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Instantiate the lock service</p>
</dd>
<dt><a href="#initLog">initLog(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the logging service</p>
</dd>
<dt><a href="#initRandom">initRandom(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the LRU Pool service</p>
</dd>
<dt><a href="#initRandom">initRandom(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the random service</p>
</dd>
<dt><a href="#initResolve">initResolve(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the <code>resolve</code> service</p>
</dd>
<dt><a href="#resolve">resolve(path)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Allow to resolve a path with the module system.</p>
</dd>
<dt><a href="#initTime">initTime(services)</a> ⇒ <code>Promise.&lt;function()&gt;</code></dt>
<dd><p>Instantiate the time service</p>
</dd>
</dl>

<a name="initCodeGenerator"></a>

## initCodeGenerator(services) ⇒ <code>Promise.&lt;function()&gt;</code> \| <code>Promise.&lt;function()&gt;</code>
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
import {
  DEFAULT_LOGGER,
  initCodeGenerator,
  initLog,
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER,
});

const codeGenerator = await initCodeGenerator({
  log,
});
```
<a name="initCodeGenerator..codeGenerator"></a>

### initCodeGenerator~codeGenerator([length]) ⇒ <code>Promise.&lt;String&gt;</code>
Returns a random code

**Kind**: inner method of [<code>initCodeGenerator</code>](#initCodeGenerator)  
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
<a name="initCounter"></a>

## initCounter(services) ⇒ <code>Promise.&lt;function()&gt;</code>
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
import {
  initCounter,
  initLog,
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER
});

const counter = await initCounter({
  COUNTER: { firstCount: 1 },
  log,
});
```
<a name="initCounter..counter"></a>

### initCounter~counter() ⇒ <code>Promise.&lt;number&gt;</code>
Returns the current count and increment the counter

**Kind**: inner method of [<code>initCounter</code>](#initCounter)  
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
<a name="initDelay"></a>

## initDelay(services) ⇒ <code>Promise.&lt;Object&gt;</code>
Instantiate the delay service

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise of the delay service  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>function</code> | <code>noop</code> | A logging function |

**Example**  
```js
import {
  DEFAULT_LOGGER,
  initDelay,
  initLog,
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER
});

const delay = await initDelay({
  log,
});
```

* [initDelay(services)](#initDelay) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~create(delay)](#initDelay..create) ⇒ <code>Promise</code>
    * [~clear(promise)](#initDelay..clear) ⇒ <code>Promise</code>

<a name="initDelay..create"></a>

### initDelay~create(delay) ⇒ <code>Promise</code>
Create a new delay

**Kind**: inner method of [<code>initDelay</code>](#initDelay)  
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
<a name="initDelay..clear"></a>

### initDelay~clear(promise) ⇒ <code>Promise</code>
Cancel an earlier created delay

**Kind**: inner method of [<code>initDelay</code>](#initDelay)  
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
<a name="initImporter"></a>

## initImporter(path) ⇒ <code>Promise.&lt;Object&gt;</code>
Allow to import ES modules.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise of an imported module.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The module path |

<a name="initLock"></a>

## initLock(services) ⇒ <code>Promise.&lt;Object&gt;</code>
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
import {
  DEFAULT_LOGGER,
  initLog,
  initDelay,
  initLock
} from 'common-services';
import ms from 'ms';

const log = await initLog({
  logger: DEFAULT_LOGGER
});
const delay = await initDelay({ log });
const lock = await initLock({
  LOCK_TIMEOUT: ms('5s'),
  delay,
  log,
});


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

* [initLock(services)](#initLock) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~take(key)](#initLock..take) ⇒ <code>Promise</code>
    * [~release(key)](#initLock..release) ⇒ <code>void</code>

<a name="initLock..take"></a>

### initLock~take(key) ⇒ <code>Promise</code>
Take the lock on the given resource key

**Kind**: inner method of [<code>initLock</code>](#initLock)  
**Returns**: <code>Promise</code> - A promise to be resolved when the lock
 is gained or rejected if the lock release
 timeout is reached.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | A unique key for the locked resource |

<a name="initLock..release"></a>

### initLock~release(key) ⇒ <code>void</code>
Release the lock on the given resource key

**Kind**: inner method of [<code>initLock</code>](#initLock)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | A unique key for the resource to release |

<a name="initLog"></a>

## initLog(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the logging service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the logging function  

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| services.logger | <code>Object</code> | The logger object that output the logs |

**Example**  
```js
import {
  DEFAULT_LOGGER,
  initLog,
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER,
});
```
<a name="initLog..log"></a>

### initLog~log(type, ...args) ⇒ <code>void</code>
Logging function

**Kind**: inner method of [<code>initLog</code>](#initLog)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Log type |
| ...args | <code>\*</code> | Log contents |

**Example**  
```js
log('debug', 'Luke, I am your father!')
```
<a name="initRandom"></a>

## initRandom(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the LRU Pool service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the LRUPool service  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>Object</code> | <code>noop</code> | A logging function |

**Example**  
```js
import {
  DEFAULT_LOGGER,
  initLog,
  initLRUPool
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER,
});

const random = await initLRUPool({
  MAX_POOL_SIZE: 50,
  poolManager: {
    // ...
  },
  log,
});
```
<a name="initRandom..random"></a>

### initRandom~random() ⇒ <code>number</code>
Returns a new random number

**Kind**: inner method of [<code>initRandom</code>](#initRandom)  
**Returns**: <code>number</code> - The random number  
**Example**  
```js
random()
// Prints: 0.3141592653589793
```
<a name="initRandom"></a>

## initRandom(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the random service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the random function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>Object</code> | <code>noop</code> | A logging function |

**Example**  
```js
import {
  DEFAULT_LOGGER,
  initLog,
  initRandom
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER,
});

const random = await initRandom({
  log,
});
```
<a name="initRandom..random"></a>

### initRandom~random() ⇒ <code>number</code>
Returns a new random number

**Kind**: inner method of [<code>initRandom</code>](#initRandom)  
**Returns**: <code>number</code> - The random number  
**Example**  
```js
random()
// Prints: 0.3141592653589793
```
<a name="initResolve"></a>

## initResolve(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the `resolve` service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the `resolve` service  

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| services.MAIN_FILE_URL | <code>String</code> | An URL pointing to the main file run |
| [services.log] | <code>function</code> | A logging function |

**Example**  
```js
import {
  DEFAULT_LOGGER,
  initLog,
  initResolve,
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER,
});

const resolve = initResolve({
  MAIN_FILE_URL: import.meta.url,
  log,
});

resolve('./myfile.ts');
}
```
<a name="resolve"></a>

## resolve(path) ⇒ <code>Promise.&lt;string&gt;</code>
Allow to resolve a path with the module system.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise of a fully qualified module path  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The serializable constants to gather |

<a name="initTime"></a>

## initTime(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Instantiate the time service

**Kind**: global function  
**Returns**: <code>Promise.&lt;function()&gt;</code> - A promise of the time function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | The services to inject |
| [services.log] | <code>Object</code> | <code>noop</code> | A logging function |

**Example**  
```js
import {
  DEFAULT_LOGGER,
  initLog,
  initTime,
} from 'common-services';

const log = await initLog({
  logger: DEFAULT_LOGGER,
});

const time = await initTime({
  log,
});
```
<a name="initTime..time"></a>

### initTime~time() ⇒ <code>number</code>
Returns the current timestamp

**Kind**: inner method of [<code>initTime</code>](#initTime)  
**Returns**: <code>number</code> - The current timestamp  
**Example**  
```js
time()
// Prints: 1326585600000
```

# Authors
- [Nicolas Froidure](http://insertafter.com/en/index.html)

# License
[MIT](https://github.com/nfroidure/common-services/blob/main/LICENSE)
