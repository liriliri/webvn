/**
 * The source code of this ui component is also served as a template. <br>
 * Every other components should be written in the same style.
 * @namespace menu
 * @memberof ui
 */
WebVN.use(function (ui, script, media, util, config, storage)
{
    var uiName  = 'menu',
        exports = ui.create(uiName),
        $el     = exports.$el,
        lang    = ui.lang.get(uiName),
        tpl     = ui.template.get(uiName),
        save    = storage.create(uiName);

    var cfg           = config.create('uiMenu'),
        cfgStartLabel = cfg.get('startLabel');

    $el.addClass('fill');
    $el.html = tpl({
        Start  : lang.get('Start'),
        Load   : lang.get('Load'),
        Gallery: lang.get('Gallery'),
        Music  : lang.get('Music'),
        Config : lang.get('Config')
    });

    var bgm   = media.audio.get('bgm'),
        se    = media.audio.get('se'),
        asset = storage.asset.create(cfg.get('path'), cfg.get('extension'));

    save.save(function () { return {} })
        .load(function () { $el.hide() });

    exports.stopPropagation().properties({
        background   : {
            set: function (val)
            {
                $el.css('background', 'url(' + asset.get(val) + ')');
            }
        },
        bgm       : cfg.get('bgm'),
        clickSound: cfg.get('clickSound'),
        hoverSound: cfg.get('hoverSound'),
        duration  : cfg.get('duration'),
        fadeIn    : cfg.get('fadeIn'),
        fadeOut   : cfg.get('FadeOut')
    }).events({

        'click .start': function () {
            if (exports.bgm) bgm.stop();

            if (exports.fadeOut)
            {
                $el.fadeOut(exports.duration, function ()
                {
                    script.jump(cfgStartLabel);
                });
            } else
            {
                $el.hide();
                script.jump(cfgStartLabel);
            }
        },

        'click .load': function () { ui.get('save').show('load') },

        'click .config': function () { ui.get('config').show() },

        'click .gallery': function () { ui.get('gallery').show() },

        'click .music': function () {
            if (exports.bgm) bgm.stop();

            ui.get('music').show();
        },

        'mouseover li': function () {
            exports.hoverSound && se.load(exports.hoverSound);
        },

        'click li': function () {
            exports.clickSound && se.load(exports.clickSound);
        }

    });

    exports.reset = function () { $el.hide() };

    /**
     * @method show
     * @memberof ui.menu
     */
    exports.show = function ()
    {
        if (exports.bgm) bgm.load(exports.bgm);

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    /**
     * @method buttons
     * @memberof ui.menu
     * @param buttons
     */
    exports.buttons = function (buttons)
    {
        util.each(buttons, function (val, key)
        {
            var $e = $el.find('ul li.' + key);

            if (util.isString(val))
            {
                $e.text = val;
            } else {
                val ? $e.show() : $e.hide();
            }
        });
    };

    exports.playBgm = function ()
    {
        exports.bgm && bgm.load(exports.bgm);
    };

});