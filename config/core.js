// Core config

webvn.use(['conf'], function (s, config) {

config.canvas = {
    fps: 30,
    duration: 200
};

config.script = {
    scenario: [
        'init',
        'first',
        'second'
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
    height: 960
};

});