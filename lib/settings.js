'use strict';

var Q = require('q'),
    debug = require('debuglog')('kraken/settings');


module.exports = function (app, options) {
    var deferred;

    debug('initializing settings');
    debug(options);

    deferred = Q.defer();
    setTimeout(deferred.resolve.bind(deferred, app), 2500);
    return deferred.promise;
};