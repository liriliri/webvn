// Command menu

webvn.use(['script', 'ui'], function (s, script, ui) {

var menu = ui.get('menu');

script.addCommand('menu', {
    'display': {
        type: Boolean,
        shortHand: 'd'
    }
}, function (options, value) {

    if (options.display === true) {
        menu.show();
    } else if (options.display === false) {
        menu.hide();
    }

});

});