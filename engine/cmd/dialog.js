// Command dialog

webvn.use(['script', 'ui'], function (s, script, ui) {

var dialog = ui.get('dialog');

script.addCommand('dialog', {
    display: {
        type: 'Boolean',
        shortHand: 'd'
    },
    name: {
        type: 'String',
        shortHand: 'n'
    },
    text: {
        type: 'String',
        shortHand: 't'
    }
}, function (options, value) {

    if (options.display === true) {
        dialog.show();
    } else if (options.display === false) {
        dialog.hide();
    }

    if (options.name) {
        dialog.name(options.name);
    }

    if (options.text) {
        dialog.text(options.text);
    }

});

});