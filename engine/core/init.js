// Initialize the game engine

(function (s, loader) {

// Load core
loader.prefix('/engine/core/');
loader.script([
    'log',
    'util',
    'class',
    'storage',
    'config',
    'script',
    'audio',
    'select'
]);

// Load command
loader.prefix('/engine/cmd/');
loader.script([
    'console'
]);

})(webvn, webvn.loader);