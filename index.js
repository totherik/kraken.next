'use strict';

var path = require('path'),
    caller = require('caller'),
    express = require('express'),
    bootstrap = require('./lib/bootstrap');


function noop(obj, cb) {
    cb(null, obj);
}


module.exports = function (options) {
    var app;

    if (typeof options === 'string') {
        options = { basedir: options };
    }

    options = options || {};
    options.onconfig = options.onconfig || noop;
    options.protocols = options.protocols || {};
    options.basedir = options.basedir || path.dirname(caller());

    app = express();
    app.once('mount', function (parent) {
        var startup;

        // Remove sacrificial express app
        parent.stack.pop();

        // Kick off server and add middleware which will block
        // until server is ready. This way we don't have to block
        // standard `listen` behavior.
        startup = bootstrap(parent, options);
        parent.use(function (req, res, next) {
            startup.done(next);
        });
    });

    return app;
};