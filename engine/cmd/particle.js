// Command particle

webvn.use(['script', 'ui'], function (s, script, ui) {

var particle = ui.get('particle');

script.createCommand('particle', {
    display: {
        type: 'Boolean',
        shortHand: 'd'
    },
    type: {
        type: 'String',
        shortHand: 't'
    }
}, function (options, value) {

    if (options.display === true) {
        particle.show();
    } else if (options.display === false) {
        particle.hide();
    }

    if (options.type) {
        particle.type(options.type);
    }

});

});