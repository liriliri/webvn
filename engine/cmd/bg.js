// Command bg

webvn.use(['script', 'ui'], function (s, script, ui) {

var background = ui.get('background');

script.createCommand('bg', {
    display: {
        type: 'Boolean',
        shortHand: 'd',
        desc: 'Whether the background is displayed'
    },
    src: {
        type: 'String',
        shortHand: 's',
        desc: 'Source of the current background image'
    }
}, function (options, value) {

    if (options.display === true) {
        background.show();
    } else if (options.display === false) {
        background.hide();
    }

    if (options.src) {
        background.src(options.src);
    }

});

});