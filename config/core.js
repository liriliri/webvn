// Core config

webvn.use(['conf'], function (s, config) {

config.canvas = {
    fps: 60,
    duration: 200
};

config.script = {
    scenarios: [
        'init',
        'first'
    ],
    prefix: '/scenario/',
    fileType: 'wvn'
};

config.system = {
    title: 'WebVN'
};

config.ui = {
    container: '#webvn',
    width: 1280,
    height: 720
};

});