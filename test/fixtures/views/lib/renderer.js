'use strict';

var fs = require('fs'),
    path = require('path'),
    dustjs = require('dustjs-linkedin');


exports.dust = function renderer(file, options, fn) {
    var name;

    dustjs.onLoad = function (name, cb) {
        fs.readFile(file, 'utf8', cb);
    };

    name = path.basename(file);
    name = name.replace(options.settings.views, '');
    dustjs.render(name, options, fn);
};