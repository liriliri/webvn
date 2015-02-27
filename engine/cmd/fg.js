// Command fg

webvn.use(['script', 'ui'], function (s, script, ui) {

var figure = ui.get('figure');

script.addCommand('fg', {
    display: {
        type: 'Boolean',
        shortHand: 'd'
    },
    src: {
        type: 'String',
        shortHand: 's'
    }
}, function (options, value) {

    if (options.display === true) {
        figure.show();
    } else if (options.display === false) {
        figure.hide();
    }

    if (options.src) {
        figure.src(options.src);
    }

});

});