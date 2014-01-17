##### Basic Usage
```javascript
'use strict';

var express = require('express'),
    kraken = require('kraken-js');

var app = express();
app.use(kraken());
app.listen(8000);
```

##### API
`kraken([basedir|options])` - The kraken factory method argument is optional and can be either the base directory to use
(String) or an options object.

```javascript
kraken(path.join(__dirname, 'app'));
```

```javascript
kraken({ basedir: path.join(__dirname, 'app') });
```


##### Options
- `basedir` (*String*, optional) - specify the working directory for kraken-js to use.
- `onconfig` (*Function*, optional) - provides an asynchronous hook for loading additional configuration. Signature: `function (config, cb) { /* ... */ }`
- `protocols` (*Object*, optional) - protocol implementations for use when processing configuration. For more information on protocols see [shortstop](https://github.com/paypal/shortstop).
- `uncaughtException` (*Function*, optional) - Handler for `uncaughtException` errors. See the [endgame](https://github.com/totherik/endgame) module for defaults.