// Command menu

webvn.use(['script', 'ui', 'media'], function (s, script, ui, media) {

var menu = ui.get('menu'),
    bgm = media.createAudio('bgm');

script.addCommand('menu', {
    'display': {
        type: 'Boolean',
        shortHand: 'd'
    },
    'bgm': {
        type: 'String',
        shortHand: 'b'
    },
    'btnHoverSound': {
        type: 'String',
        shortHand: 'bhs'
    }
}, function (options, value) {

    if (options.display === true) {
        menu.show();
    } else if (options.display === false) {
        menu.hide();
    }

    if (options.bgm) {
        bgm.load(options.bgm);
    }

    if (options.btnHoverSound) {
        menu.btnHoverSound(options.btnHoverSound);
    }

});

});