webvn.use(function (ui) {
    "use strict";
    var uiName = 'selection',
        exports = ui.create('selection'),
        $el = exports.$el,
        tpl = ui.template.get(uiName);

    $el.addClass('fill').html(tpl());

    exports.show = function () {

    };

    exports.hide = function () {

    };
});