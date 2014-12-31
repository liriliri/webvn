// Initialize the game engine

(function (s, loader) {

// Load core
loader.prefix('/engine/core/');
loader.script([
    'log',
    'util',
    'class',
    'promise',
    'ajax',
    'storage',
    'config',
    'script',
    'audio',
    'event',
    'anim',
    'select',
    'ui'
]);

// Load Ui
loader.prefix('/engine/ui/');
loader.script([
    'background',
    'rain'
]);

// Load command
loader.prefix('/engine/cmd/');
loader.script([
    'console'
]);

})(webvn, webvn.loader);