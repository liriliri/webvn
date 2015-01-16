// Initialize the game engine

(function (s, loader) {

var css = {
    ui: [
        'background'
    ]
};

var scripts = {
    cmd: [
        'console'
    ],
    core: [
        'log', 'util', 'class',
        'promise', 'ajax', 'storage',
        'config', 'script', 'audio',
        'event', 'select', 'template', 'ui'
    ],
    lib: [
    	'TweenMax'
    ],
    ui: [
        'background', 'rain'
    ],
    css: [
        'background'
    ]
};

loader.prefix('/engine/ui/').css(css.ui);

loader.prefix('/engine/core/').script(scripts.core);
loader.prefix('/engine/lib/').script(scripts.lib);
loader.prefix('/engine/ui/').script(scripts.ui);
loader.prefix('/engine/cmd/').script(scripts.cmd);

})(webvn, webvn.loader);