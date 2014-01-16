'use strict';

var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    shush = require('shush'),
    config = require('./config'),
    shortstop = require('shortstop'),
    debug = require('debuglog')('kraken/settings');


function enumerate(env, dirs, files) {
    var ext, resolved;

    ext = '.json';
    resolved = [];

    dirs.forEach(function (dir) {
        files.forEach(function (file) {
            resolved.push(path.join(dir, file + '-' + env + ext));
            resolved.push(path.join(dir, file + ext));
        });
    });

    return resolved;
}


module.exports = function (app, options) {
    var dirs, files, preprocessor, settings, deferred;

    debug('initializing settings');

    dirs = [ path.join(options.basedir, 'config'), path.resolve(__dirname, '..', 'config') ];
    files = enumerate('development', dirs, options.files);
    preprocessor = shortstop.create();

    settings = config.create();
    settings.set('basedir', options.basedir);
    files.filter(fs.existsSync).forEach(function (file) {
        var data;

        debug('loading config', file);

        data = shush(file);
        data = preprocessor.resolve(data);
        settings.use(file, data);
    });

    app.set('kraken', settings);

    deferred = Q.defer();
    options.onconfig(settings, function (err) {
        err ? deferred.reject(err) : deferred.resolve(app);
    });
    return deferred.promise;
};