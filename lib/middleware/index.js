'use strict';

var meddleware = require('meddleware'),
    debug = require('debuglog')('kraken/middleware');


module.exports = function middleware(app) {
    var config;

    debug('initializing middleware');
    config = app.get('kraken').get('middleware') || {};
    app.use(meddleware(config));

    return app;
};