// Command menu

webvn.use(['script', 'ui', 'media'], function (s, script, ui, media) {

var menu = ui.get('menu');

script.createCommand('menu', {
    'display': {
        type: 'Boolean',
        shortHand: 'd'
    },
    'bgm': {
        type: 'String',
        shortHand: 'bgm'
    },
    'btnHoverSound': {
        type: 'String',
        shortHand: 'bhs'
    },
    'btnClickSound': {
        type: 'String',
        shortHand: 'bcs'
    },
    'btn': {
        type: 'Json',
        shortHand: 'btn'
    }
}, function (options, value) {

    if (options.display === true) {
        menu.show();
    } else if (options.display === false) {
        menu.hide();
    }

    if (options.bgm) {
        menu.bgm(options.bgm);
    }

    if (options.btnHoverSound) {
        menu.btnSound(options.btnHoverSound, 'hover');
    }

    if (options.btnClickSound) {
        menu.btnSound(options.btnClickSound, 'click');
    }

    if (options.btn) {
        menu.btn(options.btn);
    }

});

});