webvn.use(['ui'], function (ui) {
    "use strict";
    var exports = ui.create('setting');

    var tpl = ui.getTemplate('setting');
    exports.body(tpl);

    var $el = exports.$el;
    $el.addClass('fill');

    exports.stopPropagation();
    exports.event({
        'click .close': function () {
            hide();
        }
    });

    exports.show = function () {
        $el.fadeIn(300);
    };

    var hide = exports.hide = function () {
        $el.fadeOut(300);
    };

    return exports;
});