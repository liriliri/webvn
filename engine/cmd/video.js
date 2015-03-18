// Command video

webvn.use(['script', 'ui'], function (s, script, ui) {

var video = ui.get('video');

script.createCommand('video', {
    display: {
        type: 'Boolean',
        shortHand: 'd'
    },
    click: {
        type: 'String',
        shortHand: 'c'
    },
    play: {
        type: 'Boolean',
        shortHand: 'pl'
    },
    src: {
        type: 'String',
        shortHand: 's'
    }
}, function (options, value) {

    if (options.display === true) {
        video.show();
    } else if (options.display === false) {
        video.hide();
    }

    if (options.src) {
        video.src(options.src);
    }

    if (options.play === true) {
        video.play();
    } else if (options.play === false) {
        video.stop();
    }

    if (!options.click) {
        options.click = 'stop';
    }
    video.clickAction(options.click);

});

});