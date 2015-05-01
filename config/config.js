/**
 * Stores all configuration of all modules.
 * @namespace webvn.config
 */
webvn.module('config', ['util'], function (util) {

    var exports = {};

    exports.debug = true;

    // Config can be overitten by global config
    if (window.config) {
        util.mix(exports, window.config);
    }

    // 3rd lib bower location
    exports.bower = {
        'engine/lib/TweenMax.js': 'gsap/src/uncompressed/TweenMax.js'
    };

    return exports;

});