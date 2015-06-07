WebVN.use(function (ui, config, media)
{
    var uiName = 'config',
        exports = ui.create(uiName),
        $el = exports.$el,
        lang = ui.lang.get(uiName),
        tpl = ui.template.get(uiName);

    var cfg = config.create('uiConfig');

    $el.addClass('fill');
    $el.html = tpl({
        Config: lang.get('Config'),
        Close: lang.get('Close'),
        Text_Speed: lang.get('Text Speed'),
        Text_Auto: lang.get('Text Auto'),
        Music: lang.get('Music'),
        Sound: lang.get('Sound'),
        Voice: lang.get('Voice')
    });

    var audio = media.audio,
        bgm = audio.get('bgm'),
        se = audio.get('se'),
        vo = audio.get('vo');

    $el.find('.music').val = bgm.volume;
    $el.find('.sound').val = se.volume;
    $el.find('.voice').val = vo.volume;

    exports.stopPropagation().properties({
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('fadeOut'),
        duration: cfg.get('duration')
    }).events({

        'click .close': function () {
            hide();
        },

        'change .text-speed': function () {
            ui.get('dialog').textSpeed = this.val();
        },

        'change .music': function () { bgm.volume = this.val },
        'change .sound': function () { se.volume  = this.val },
        'change .voice': function () { vo.volume  = this.val }

    });

    exports.show = function () {
        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    var hide = exports.hide = function () {
        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };

    return exports;
});