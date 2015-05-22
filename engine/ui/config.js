webvn.use(function (ui, canvas, config) {
    "use strict";
    var uiName = 'config',
        exports = ui.create(uiName),
        $el = exports.$el,
        lang = ui.lang.get(uiName),
        tpl = ui.template.get(uiName);

    var cfg = config.create('uiConfig');

    exports.fadeIn = cfg.get('fadeIn');
    exports.fadeOut = cfg.get('fadeOut');
    exports.duration = cfg.get('duration');

    $el.addClass('fill').html(tpl({
        Config: lang.get('Config'),
        Close: lang.get('Close'),
        Text_Speed: lang.get('Text Speed'),
        Text_Auto: lang.get('Text Auto'),
        Music: lang.get('Music'),
        Sound: lang.get('Sound'),
        Voice: lang.get('Voice')
    }));

    var renderer = canvas.renderer;

    exports.stopPropagation().events({

        'click .close': function () {
            hide();
        }

    });

    exports.show = function () {
        renderer.stop();

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    var hide = exports.hide = function () {
        renderer.start();

        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };

    return exports;
});