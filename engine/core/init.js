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
        'event', 'anim', 'select',
        'ui'
    ],
    ui: [
        'background', 'rain'
    ]
};

loader.prefix('/engine/core/').script(scripts.core);
loader.prefix('/engine/ui/').script(scripts.ui);
loader.prefix('/engine/cmd/').script(scripts.cmd);

})(webvn, webvn.loader);