// Global configuration

var config = {};

// 3rd lib bower location
config.bower = {
    'engine/lib/TweenMax.js': 'gsap/src/uncompressed/TweenMax.js'
};

// Files that is loaded when initialize
config.loadFiles = {
    // Css files
    css: {
        ui: [
            'base',
            'menu',
            'background'
        ],
        custom: [
            'base',
            'ui'
        ]
    },
    // Js files
    js: {
        // Engine core
        core: [
            'log',
            'util',
            'select',
            'class',
            'storage',
            'config',
            'system',
            'promise',
            'ajax',
            'parser',
            'script',
            'audio',
            'event',
            'template',
            'ui'
        ],
        // Engine extension
        ext: [
        ],
        // Third library
        lib: [
            'TweenMax'
        ],
        // Ui components
        ui: [
            'menu',
            'background',
            'rain'
        ],
        // Command
        cmd: [
            'log',
            'bg',
            'bgm'
        ],
        // Scripts after all module is loading
        init: [
            'init'
        ]
    },
    prefix: {
        css: {
            ui: '/engine/ui/',
            custom: '/custom/'
        },
        js: {
            core: '/engine/core/',
            lib: '/engine/lib/',
            ui: '/engine/ui/',
            cmd: '/engine/cmd/',
            init: '/engine/'
        }
    }
};

// Script module config
config.script = {
    scenario: [
        'first',
        'second'
    ],
    prefix: '/scenario/',
    fileType: 'wvn'
};

// System module config
config.system = {
    title: 'WebVN'
};

// Ui module config
config.ui = {
    container: '#webvn',
    width: 1280,
    height: 960
};

// Exports config to be read by nodejs program
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = config;
}
