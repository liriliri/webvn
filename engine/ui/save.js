webvn.use(['ui', 'config'], function (ui, config) {
    "use strict";
    var exports = ui.create('save');

    var conf = config.create('uiSave');

    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');

    exports.stopPropagation();
    exports.event({
        'click .close': function () {
            hide();
        }
    });

    var tpl = ui.getTemplate('save');
    exports.body(tpl);

    var $el = exports.$el;
    $el.addClass('fill');

    var $title = $el.find('.title');

    function initSave() {

    }

    function initLoad() {
        $title.text('Load');
    }

    exports.show = function (type) {
        if (type === 'save') {
            initSave();
        } else {
            initLoad();
        }

        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
    };

    var hide = exports.hide = function () {
        if (exports.fadeOut) {
            $el.fadeOut(exports.duration);
        } else {
            $el.hide();
        }
    };
});