SpeedOfMe
=========

[![Build Status](https://img.shields.io/travis/gordonwritescode/speedofme.svg?style=flat-square)](https://travis-ci.org/gordonwritescode/speedofme)
[![Coverage Status](https://img.shields.io/coveralls/gordonwritescode/speedofme.svg?style=flat-square)](https://coveralls.io/r/gordonwritescode/speedofme)
[![NPM](https://img.shields.io/npm/v/speedofme.svg?style=flat-square)](https://www.npmjs.com/package/speedofme)

Simple bandwidth and speed testing client and server.

Programmatic Usage
------------------

Install locally with NPM:

```
npm install speedofme --save
```

### Server

```js
var Server = require('speedofme').Server;
var server = new Server({ port: 8080 });

// That's it!
```

### Client

```js
var Client = require('speedofme').Client;
var client = new Client({ url: 'ws://127.0.0.1:8080' });

client.test(function(err, result) {
  console.log(result); // { download: Number, upload: Number }
});
```

Command Line Interface
----------------------

Install globally with NPM:

```
npm install speedofme --global
```

### Server

```
speedofme server 8080
```

### Client

```
speedofme client 127.0.0.1:8080
```

License
-------

SpeedOfMe - Simple bandwidth and speed testing client and server.  
Copyright (C) 2016  Gordon Hall

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.
