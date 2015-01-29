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
        ]
    },
    // Js files
    js: {
        // Engine core
        core: [
            'log',
            'util',
            'system',
            'class',
            'promise',
            'ajax',
            'storage',
            'config',
            'script',
            'audio',
            'event',
            'select',
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
            ui: '/engine/ui/'
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
    scripts: [
        'first'
    ],
    cwd: '/script/'
};

// Ui module config
config.ui = {
    container: '#webvn'
};

// Exports config to be read by nodejs program
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = config;
}
