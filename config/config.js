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

return config;

});