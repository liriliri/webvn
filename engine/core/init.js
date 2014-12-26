// Initialize the game engine

(function (s, loader) {

// Load core
loader.prefix('/engine/core/');
loader.script([
    'log',
    'util',
    'class',
    'promise',
    'storage',
    'config',
    'script',
    'audio',
    'event',
    'anim',
    'select',
]);

// Load command
loader.prefix('/engine/cmd/');
loader.script([
    'console'
]);

})(webvn, webvn.loader);