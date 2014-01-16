'use strict';

var meddleware = require('meddleware'),
    debug = require('debuglog')('kraken/middleware');


module.exports = function middleware(app) {
    var config;

    debug('initializing middleware');
    config = app.get('middleware') || {};
    app.use(meddleware(config));

    // Temporary, for testing
    app.use(require('./shutdown')());

    return app;
};