// Initialize the game engine

(function (s, loader) {

var scripts = {
    cmd: [
        'console'
    ],
    core: [
        'log', 'util', 'class',
        'promise', 'ajax', 'storage',
        'config', 'script', 'audio',
        'event', 'select', 'ui'
    ],
    lib: [
    	'TweenMax'
    ],
    ui: [
        'background', 'rain'
    ]
};

loader.prefix('/engine/core/').script(scripts.core);
loader.prefix('/engine/lib/').script(scripts.lib);
loader.prefix('/engine/ui/').script(scripts.ui);
loader.prefix('/engine/cmd/').script(scripts.cmd);

})(webvn, webvn.loader);