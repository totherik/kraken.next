'use strict';

var requires = {};


module.exports = function raptor(path, options, fn) {
    var engine;

    // TROLOL - raptor needs to "install" itself, so you need to require
    // the base package before you can require child packages.
    engine = requires.raptor || (require('raptor') && (requires.raptor = require('raptor/templating')));
    fn(null, engine.renderToString(path, options));
};