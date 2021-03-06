# slackoon

[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![NPM version][npm-v-image]][npm-url]
[![NPM Downloads][npm-dm-image]][npm-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Node.js slack.com API


## Installation
```sh
npm install slackoon --save
```

--------------------------------------------------------------------------------

## Usage
```js
'use strict';
const Slackoon = require('slackoon');

const slackbot = new Slackoon('aaaa-000000000000-aaaaaaaaaaaaaaaaaaaaaaaaaa'); //Your skack bot token

slackbot.query('chat.postMessage', {
  channel: "#general",
  text: "Hello from *Slackoon*",
  parse: "full"
})
.then((res) => {
  console.log(res);
});
```

--------------------------------------------------------------------------------

## API
### Slackoon(options)
**Arguments**
* **options** {`Object|String`} - token or options object
  * [**token**] {`String`}
  * [**requestDefaults**] {`Object`}

**Returns**
* {`Slackoon`}

**Example**

```js
'use strict';
const Slackoon = require('slackoon');

const slackbot = new Slackoon('aaaa-000000000000-aaaaaaaaaaaaaaaaaaaaaaaaaa');
// Or
const secSlackbot = new Slackoon({
  token: 'aaaa-000000000000-aaaaaaaaaaaaaaaaaaaaaaaaaa',
  requestDefaults: {
    headers: {
      'User-Agent': "slackbot 3000"
    }
  }
}); 
```


### Slackoon#whoami(): Promise
**Returns**
* {`Promise`}

**Example**

```js
'use strict';
const Slackoon = require('slackoon');

const slackbot = new Slackoon('aaaa-000000000000-aaaaaaaaaaaaaaaaaaaaaaaaaa');

slackbot.whoami()
.then((res) => {
  console.log(res);
  /*
  {
    ok: true,
    url: 'https://***.slack.com/',
    team: '***',
    user: '***',
    team_id: '***',
    user_id: '***'
  }
   */
});
```


### Slackoon#query(method, options?): Promise
**Arguments**
* **method** {`String`}
* [**options**] {`Object`}

**Returns**
* {`Promise`}

**Example**

```js
'use strict';
const Slackoon = require('slackoon');

const slackbot = new Slackoon('aaaa-000000000000-aaaaaaaaaaaaaaaaaaaaaaaaaa');
slackbot.query('chat.postMessage', {
  channel: "#general",
  text: "Hello from *Slackoon*",
  parse: "full"
})
.then((res) => {
  console.log(res);
});
```

--------------------------------------------------------------------------------

## Changelog
### 0.1.0 [`Stable`]
* **Added**: first release

--------------------------------------------------------------------------------

## License
Copyright (c)  2016 [Alexander Krivoshhekov][github-author-link]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[github-author-link]: http://github.com/SuperPaintman
[npm-url]: https://www.npmjs.com/package/slackoon
[npm-v-image]: https://img.shields.io/npm/v/slackoon.svg
[npm-dm-image]: https://img.shields.io/npm/dm/slackoon.svg
[travis-image]: https://img.shields.io/travis/SuperPaintman/slackoon/master.svg?label=linux
[travis-url]: https://travis-ci.org/SuperPaintman/slackoon
[appveyor-image]: https://img.shields.io/appveyor/ci/SuperPaintman/slackoon/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/SuperPaintman/slackoon
[coveralls-image]: https://img.shields.io/coveralls/SuperPaintman/slackoon/master.svg
[coveralls-url]: https://coveralls.io/r/SuperPaintman/slackoon?branch=master
