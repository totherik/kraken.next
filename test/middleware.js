'use strict';

var test = require('tape'),
    path = require('path'),
    kraken = require('../'),
    nconf = require('nconf'),
    express = require('express');

test('middleware', function (t) {

    function reset() {
        nconf.stores  = {};
        nconf.sources = [];
    }

    t.test('no config', function (t) {
        var basedir, app;

        t.on('end', reset);

        basedir = path.join(__dirname, 'fixtures', 'middleware');
        app = express();
        app.on('start', t.end.bind(t));
        app.on('error', t.error.bind(t));
        app.use(kraken(basedir));
    });

});