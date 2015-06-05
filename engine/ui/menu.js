/* This ui component is also served as a template.
 * Every other components should be written in the same style.
 */
webvn.use(function (ui, script, media, util, config, storage)
{
    var uiName  = 'menu',
        exports = ui.create(uiName),
        $el     = exports.$el,
        lang    = ui.lang.get(uiName),
        tpl     = ui.template.get(uiName),
        save    = storage.create(uiName);

    var cfg           = config.create('uiMenu'),
        cfgStartLabel = cfg.get('startLabel');

    $el.addClass('fill').html(tpl({
        'Start'  : lang.get('Start'),
        'Load'   : lang.get('Load'),
        'Gallery': lang.get('Gallery'),
        'Music'  : lang.get('Music'),
        'Config' : lang.get('Config')
    }));

    var bgm = media.audio.get('bgm'),
        se = media.audio.get('se');

    save.save(function () {
        return {};
    }).load(function () {
        $el.hide();
    });

    exports.stopPropagation().properties({
        bgm: cfg.get('bgm'),
        btnClickSound: cfg.get('btnClkSound'),
        btnHoverSound: cfg.get('btnHoverSound'),
        duration: cfg.get('Duration'),
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('FadeOut')
    }).events({

        'click .start': function () {
            if (exports.bgm) bgm.stop();

            if (exports.fadeOut) {
                $el.fadeOut(exports.duration, function () {
                    script.jump(cfgStartLabel);
                });
            } else {
                $el.hide();
                script.jump(cfgStartLabel);
            }
        },

        'click .load': function () {
            ui.get('save').show('load');
        },

        'click .setting': function () {
            ui.get('config').show();
        },

        'click .cg': function () {
            ui.get('gallery').show();
        },

        'click .music': function () {
            if (exports.bgm) bgm.stop();

            ui.get('music').show();
        },

        'mouseover li': function () {
            if (exports.btnHoverSound) se.load(exports.btnHoverSound);
        },

        'click li': function () {
            if (exports.btnClickSound) se.load(exports.btnClickSound);
        }

    });

    exports.reset = function () {
        $el.hide();
    };

    exports.show = function () {
        if (exports.bgm) bgm.load(exports.bgm);

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    exports.buttons = function (buttons) {
        util.each(buttons, function (value, key) {
            var $e = $el.find('ul li.' + key);

            if (util.isString(value)) {
                $e.text(value);
                return;
            }

            value ? $e.css('display', 'block') : $e.css('display', 'none');
        });
    };

    exports.playBgm = function () {
        if (exports.bgm) bgm.load(exports.bgm);
    };

});