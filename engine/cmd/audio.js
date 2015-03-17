// Command bgm

webvn.use(['script', 'media'], function (s, script, media) {

// Background music
var bgm = media.createAudio('bgm');

script.addCommand('bgm', {
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
        bgm.load(options.src);
    }

    if (options.loop === true) {
        bgm.loop(true);
    } else if (options.loop === false) {
        bgm.loop(false);
    }

});

// Sound Effect
var se = media.createAudio('se');

script.addCommand('se', {
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

script.addCommand('vo', {
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
