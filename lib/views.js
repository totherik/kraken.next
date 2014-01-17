'use strict';

var debug = require('debuglog')('kraken/views');


module.exports = function views(app) {
    var engines;

    debug('initializing views');

    engines = app.kraken.get('view engines') || {};
    Object.keys(engines).forEach(function (ext) {
        var spec, module, args, engine;

        spec = engines[ext];
        module = require(spec.module);

        if (typeof module[spec.rendererFactory] === 'function') {
            args = Array.isArray(spec['arguments']) ? spec['arguments'].slice() : [];
            engine = module[spec.rendererFactory].apply(null, args);

        } else if (typeof module[spec.renderer] === 'function') {
            engine = module[spec.renderer];

        } else if (typeof module[spec.name] === 'function') {
            engine = module[spec.name];

        } else if (typeof module[ext] === 'function') {
            engine = module[ext];

        } else {
            engine = module;
        }

        // It's possible to override the default view, but it's a separate setting
        // than `view engine` so we need to do our best to keep them in sync here.
        if (app.get('view engine') === ext && typeof spec.viewConstructor === 'string') {
            app.set('view', require(spec.viewConstructor));
        }

        app.engine(ext, engine);
    });

    return app;
};