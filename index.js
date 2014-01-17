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
        var deferred;

        // Remove sacrificial express app
        parent.stack.pop();

        // Kick off server and add middleware which will block until
        // server is ready. This way we don't have to block standard
        // `listen` behavior, but failures will occur immediately.
        deferred = Q.defer();
        bootstrap(parent, options)
            .then(deferred.resolve.bind(deferred))
            .catch(parent.emit.bind(parent, 'error'))
            .done();

        parent.use(function (req, res, next) {
            if (deferred.promise.isFulfilled()) {
                return next();
            }
            res.send(503, 'Server is starting.');
        });
    });

    return app;
};