// Command dialog

webvn.use(['script', 'ui', 'media'], 
    function (s, script, ui, media) {

var dialog = ui.get('dialog');

script.createCommand('dialog', {
    display: {
        type: 'Boolean',
        shortHand: 'd'
    },
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
    name: {
        type: 'String',
        shortHand: 'n'
    },
    text: {
        type: 'String',
        shortHand: 't'
    },
    textDuration: {
        type: 'Number',
        shortHand: 'td'
    },
    textType: {
        type: 'String',
        shortHand: 'tt'
    },
    voice: {
        type: 'String',
        shortHand: 'v'
    }
}, function (options, value) {

    if (options.fadeIn === true) {
        dialog.fadeIn = true;
    } else if (options.fadeIn === false) {
        dialog.fadeIn = false;
    }

    if (options.fadeOut === true) {
        dialog.fadeOut = true;
    } else if (options.fadeOut === false) {
        dialog.fadeOut = false;
    }

    if (options.duration) {
        dialog.duration = options.duration;
    }

    if (options.textType) {
        dialog.textType = options.textType;
    }

    if (options.textDuration) {
        dialog.textDuration = options.textDuration;
    }

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

    if (options.voice) {
        dialog.voice(options.voice);
    }

});

});