// Command fg

webvn.use(['script', 'ui'], function (s, script, ui) {

var figure = ui.get('figure');

script.createCommand('fg', {
    display: {
        type: 'Boolean',
        shortHand: 'd'
    },
    select: {
        type: 'Number',
        shortHand: 'sel'
    },
    src: {
        type: 'String',
        shortHand: 's'
    },
    x: {
        type: 'Number',
        shortHand: 'x'
    },
    y: {
        type: 'Number',
        shortHand: 'y'
    },
    position: {
        type: 'String',
        shortHand: 'pos'
    }
}, function (options, value) {

    if (options.select) {
        figure.select(options.select);
    }

    if (options.display === true) {
        figure.show();
    } else if (options.display === false) {
        figure.hide();
    }

    if (options.src) {
        figure.src(options.src);
    }

    if (options.x) {
        figure.pos(options.x);
    }

    if (options.y) {
        figure.pos(null, options.y);
    }

    if (options.position) {
        figure.pos(options.position);
    }

});

});