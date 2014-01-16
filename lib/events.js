'use strict';

var debug = require('debuglog')('kraken/events');

module.exports = function events(app) {

    var timer;

    app.on('shutdown', function onshutdown(server, timeout) {
        var exit, ok, err;

        exit = process.exit.bind(process);
        ok = exit.bind(null, 0);
        err = exit.bind(null, 1);

        debug('process shutting down');
        server.close(ok);
        clearTimeout(timer);
        timer = setTimeout(err, timeout);
    });

    return app;
};