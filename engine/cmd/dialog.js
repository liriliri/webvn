// Command dialog

webvn.use(['script', 'ui', 'media'], 
    function (s, script, ui, media) {

var dialog = ui.get('dialog'),
    voice = media.createAudio('voice');

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
    },
    voice: {
        type: 'String',
        shortHand: 'v'
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

    if (options.voice) {
        voice.load(options.voice);
    }

});

});