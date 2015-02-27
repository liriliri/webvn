// Command bgm

webvn.use(['script', 'audio'], function (s, script, audio) {

// Background music
var bgm = audio.create('bgm');

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
        bgm.setLoop(true);
    } else if (options.loop === false) {
        bgm.setLoop(false);
    }

});

// Sound Effect
var se = audio.create('se');

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
        se.setLoop(true);
    } else if (options.loop === false) {
        se.setLoop(false);
    }

});

// Voice
var voice = audio.create('voice');

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
        voice.setLoop(true);
    } else if (options.loop === false) {
        voice.setLoop(false);
    }

});

});
