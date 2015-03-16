// Command menu

webvn.use(['script', 'ui', 'audio'], function (s, script, ui, audio) {

var menu = ui.get('menu'),
    bgm = audio.create('bgm');

script.addCommand('menu', {
    'display': {
        type: 'Boolean',
        shortHand: 'd'
    },
    'bgm': {
        type: 'String',
        shortHand: 'b'
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

});

});