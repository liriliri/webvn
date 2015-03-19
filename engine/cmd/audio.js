// Command bgm

webvn.use(['script', 'media'], function (s, script, media) {

// Background music
var bgm = media.createAudio('bgm');

script.createCommand('bgm', {
    duration: {
        type: 'Number',
        shortHand: 'du'
    },
    fadeIn: {
        type: 'Boolean',
        shortHand: 'fi'
    },
    fadeOut: {
        type: 'Boolean',
        shortHand: 'fo'
    },
    loop: {
        type: 'Boolean',
        shortHand: 'l'
    },
    play: {
        type: 'Boolean',
        shortHand: 'p'
    },
    src: {
        type: 'String',
        shortHand: 's'
    },
    stop: {
        type: 'Boolean',
        shortHand: 'st'
    },
    volume: {
        type: 'Number',
        shortHand: 'v'
    }
}, function (options, value) {

    if (options.fadeIn === true) {
        bgm.fadeIn = true;
    } else if (options.fadeIn === false) {
        bgm.fadeIn = false;
    }

    if (options.fadeOut === true) {
        bgm.fadeOut = true;
    } else if (options.fadeOut === false) {
        bgm.fadeOut = false;
    }

    if (options.duration) {
        bgm.duration = options.duration;
    }

    if (options.play === true) {
        bgm.play();
    } else if (options.play === false) {
        bgm.pause();
    }

    if (options.loop === true) {
        bgm.loop(true);
    } else if (options.loop === false) {
        bgm.loop(false);
    }

    if (options.stop === true) {
        bgm.stop();
    }

    if (options.src) {
        bgm.load(options.src);
    }

});

// Sound Effect
var se = media.createAudio('se');

script.createCommand('se', {
    loop: {
        type: 'Boolean',
        shortHand: 'l'
    },
    src: {
        type: 'String',
        shortHand: 's'
    }
}, function (options, value) {

    if (options.src) {
        se.load(options.src);
    }

    if (options.loop === true) {
        se.setloop(true);
    } else if (options.loop === false) {
        se.setloop(false);
    }

});

// Voice
var voice = media.createAudio('voice');

script.createCommand('vo', {
    loop: {
        type: 'Boolean',
        shortHand: 'l'
    },
    src: {
        type: 'String',
        shortHand: 's'
    }
}, function (options, value) {

    if (options.src) {
        voice.load(options.src);
    }

    if (options.loop === true) {
        voice.loop(true);
    } else if (options.loop === false) {
        voice.loop(false);
    }

});

});
