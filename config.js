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
            'basic',
            'background'
        ],
        custom: [
            'base'
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
            'background',
            'rain'
        ],
        // Command
        cmd: [
            'console'
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
    width: 960,
    height: 480,
    title: 'WebVN'
};

// Ui module config
config.ui = {
    container: '#webvn'
};

// Exports config to be read by nodejs program
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = config;
}
