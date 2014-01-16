'use strict';

var Q = require('q'),
    debug = require('debuglog')('kraken/settings');


module.exports = function (app, options) {
    var deferred;

    debug('initializing settings');
    debug(options);

    deferred = Q.defer();
    options.onconfig(app, deferred.makeNodeResolver());
    return deferred.promise;
};