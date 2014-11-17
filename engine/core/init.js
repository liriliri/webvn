// Initialize the game engine

(function (s, loader) {

// Load core
loader.prefix('engine/core/');
loader.script([
    'log.js',
    'util.js',
    'class.js',
    'config.js',
    'script.js'
]);

})(webvn, webvn.loader);