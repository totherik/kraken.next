'use strict';

var Q = require('q'),
    path = require('path'),
    caller = require('caller'),
    express = require('express'),
    bootstrap = require('./lib/bootstrap'),
    debug = require('debuglog')('kraken');


function noop(obj, cb) {
    cb(null, obj);
}


module.exports = function (options) {
    var app;

    if (typeof options === 'string') {
        options = { basedir: options };
    }

    options = options || {};
    options.protocols = options.protocols || {};
    options.onconfig  = options.onconfig || noop;
    options.basedir   = options.basedir || path.dirname(caller());

    debug('starting kraken with:', '\n', options);

    app = express();
    app.once('mount', function (parent) {
        var deferred, complete, emit;

        // Remove sacrificial express app
        parent.stack.pop();

        deferred = Q.defer();
        complete = deferred.resolve.bind(deferred);
        emit = parent.emit.bind(parent, 'error');

        // Kick off server and add middleware which will block until
        // server is ready. This way we don't have to block standard
        // `listen` behavior, but failures will occur immediately.
        bootstrap(parent, options)
            .then(complete)
            .catch(emit)
            .done();

        parent.use(function (req, res, next) {
            if (deferred.promise.isFulfilled()) {
                next();
                return;
            }
            res.send(503, 'Server is starting.');
        });
    });

    return app;
};