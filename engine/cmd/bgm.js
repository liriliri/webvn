// Command bgm

webvn.use(['script', 'audio'], function (s, script, audio) {

var bgm = audio.create('bgm');

script.addCommand('bgm', {
    loop: {
        type: Boolean,
        shortHand: 'l'
    },
    src: {
        type: String,
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

});
