##### Usage
```javascript
'use strict';

var express = require('express'),
    kraken = require('kraken-js');

var app = express();
app.use(kraken());
app.listen(8000);
```


##### Options
- `basedir` (*String*, optional) - specify the working directory for kraken-js to use.
- `onconfig` (*Function*, optional) - provides an asynchronous hook for loading additional configuration. Signature: `function (config, cb) { /* ... */ }`
- `protocols` (*Object*, optional) - protocol implementations for use when processing configuration. For more information on protocols, see paypal/shortstop.
