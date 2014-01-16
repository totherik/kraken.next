```javascript
'use strict';

var express = require('express'),
    kraken = require('kraken');

var app = express();
app.use(kraken());
app.listen(8000);
```