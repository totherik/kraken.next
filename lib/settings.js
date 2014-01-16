'use strict';

var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    shush = require('shush'),
    config = require('./config'),
    shortstop = require('shortstop'),
    debug = require('debuglog')('kraken/settings');

/**
 * Creates the file paths permutations of the provided files and directories.
 * @param env
 * @param dirs
 * @param files
 * @returns {Array}
 */
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


/**
 *
 * @param preprocessor
 * @param settings
 * @returns {use}
 */
function load(preprocessor, settings) {
    return function use(file) {
        var data;

        debug('loading config', file);
        data = shush(file);
        data = preprocessor.resolve(data);
        settings.use(file, data);
    }
}


/**
 * Creates the protocol handler for the `path:` protocol
 * @param basedir
 * @returns {file}
 */
function createPathHandler(basedir) {
    return function file(file) {
        if (path.resolve(file) === file) {
            // Absolute path already, so just return it.
            return file;
        }
        file = file.split('/');
        file.unshift(basedir);
        return path.resolve.apply(path, file);
    };
}


/**
 * Creates the protocol handler for the `file:` protocol
 * @param basedir
 * @returns {fileHandler}
 */
function createFileHandler(basedir) {
    var pathHandler = createPathHandler(basedir);
    return function fileHandler(file) {
        file = pathHandler(file);
        return fs.readFileSync(file);
    };
}


/**
 * The protocol handler for the `buffer:` protocol
 * @param value
 * @returns {Buffer}
 */
function base64Handler(value) {
    return new Buffer(value, 'base64');
}


module.exports = function (app, options) {
    var preprocessor, settings, dirs, deferred;

    debug('initializing settings');

    // Setup the shortstop instance.
    preprocessor = shortstop.create();
    preprocessor.use('file', createFileHandler(options.basedir));
    preprocessor.use('path', createPathHandler(options.basedir));
    preprocessor.use('base64', base64Handler);
    Object.keys(options.protocols).forEach(function (protocol) {
        preprocessor.use(protocol, options.protocols[protocol]);
    });

    // Create the actual settings object
    settings = config.create();
    settings.set('basedir', options.basedir);

    // Enumerate files to load, process and load
    dirs = [ path.join(options.basedir, 'config'), path.resolve(__dirname, '..', 'config') ];
    enumerate(settings.get('env:env'), dirs, options.files)
        .filter(fs.existsSync)
        .forEach(load(preprocessor, settings));

    deferred = Q.defer();
    options.onconfig(settings, deferred.makeNodeResolver());
    return deferred.promise.then(function (settings) {
        return app.set('kraken', settings);
    });
};