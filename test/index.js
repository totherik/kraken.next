'use strict';

var test = require('tape'),
    kraken = require('../'),
    express = require('express');



test('kraken', function (t) {

    t.test('startup', function (t) {
        var app, server;

        t.plan(1);

        function startup() {
            t.pass('server started');
            server.close(t.end.bind(t));
        }

        function error(err) {
            t.error(err, 'server startup failed');
            t.end();
        }

        app = express();
        app.on('start', startup);
        app.on('error', error);
        app.use(kraken());
        server = app.listen(8000);
    });

});