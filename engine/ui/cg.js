webvn.use(['ui'],
    function (s, ui) {
        "use strict";
        var exports = ui.create('cg', 'div'),
            $el = exports.$el;
        var tpl = ui.getTemplate('cg');
        exports.body(tpl);

        $el.addClass('fill');

        exports.show = function () {
            $el.show();
        };

        exports.hide = function () {
            $el.hide();
        };
    });