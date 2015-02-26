// Global configuration

webvn.add('conf', ['util'], function (s, util) {

var config = {
    debug: true
};

// Config can be overitten by global config
if (window.config) {
    util.mix(config, window.config);
}

// 3rd lib bower location
config.bower = {
    'engine/lib/TweenMax.js': 'gsap/src/uncompressed/TweenMax.js'
};

// Script module config
config.script = {
    scenario: [
        'init',
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

return config;

});