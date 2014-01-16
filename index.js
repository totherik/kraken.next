'use strict';

var path = require('path'),
    caller = require('caller'),
    express = require('express'),
    bootstrap = require('./lib/bootstrap'),
    debug = require('debuglog')('kraken');


var CONFIG_FILES, slice;

CONFIG_FILES = ['app', 'middleware'];
slice = Function.prototype.call.bind(Array.prototype.slice);

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
    options.files     = Array.isArray(options.files) ? slice(options.files).concat(CONFIG_FILES) : CONFIG_FILES;
    options.basedir   = options.basedir || path.dirname(caller());

    debug('starting kraken with:', '\n', options);

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