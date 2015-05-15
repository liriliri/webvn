webvn.use(['ui', 'canvas'], function (ui, canvas) {
    "use strict";
    var exports = ui.create('setting');

    var tpl = ui.template.get('setting');
    var $el = exports.$el;
    $el.addClass('fill').html(tpl);

    exports.stopPropagation().events({
        'click .close': function () {
            hide();
        }
    });

    var renderer = canvas.renderer;

    exports.show = function () {
        renderer.stop();
        $el.fadeIn(300);
    };

    var hide = exports.hide = function () {
        renderer.start();
        $el.fadeOut(300);
    };

    return exports;
});