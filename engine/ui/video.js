/**
 * @namespace video
 * @memberof ui
 */
WebVN.use(function (ui, media, script, config, storage)
{
    var uiName  = 'video',
        exports = ui.create('video', 'div'),
        $el     = exports.$el,
        tpl     = ui.template.get(uiName);

    var cfg          = config.create('uiVideo'),
        cfgPath      = cfg.get('path'),
        cfgExtension = cfg.get('extension');

    $el.addClass('fill');
    $el.html = tpl();

    var asset = storage.asset.create(cfgPath, cfgExtension),
        video = media.video.create($el.find('video').get(0));

    exports.stopPropagation().properties({
        clickAction: cfg.get('clickAction'),
        duration   : cfg.get('duration'),
        fadeIn     : cfg.get('fadeIn'),
        fadeOut    : cfg.get('fadeOut')
    }).events({

        'click video': function ()
        {
            switch (exports.clickAction)
            {
                case 'skip': video.stop(); hide(); break;
                case 'pause':
                    video.isPlaying() ? video.pause()
                                      : video.play();
                    break;
            }
        }

    });

    video.events({

        ended: function () { hide(); }

    });

    exports.show = function ()
    {
        if ($el.visible()) return;

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();

        script.pause();
    };

    function hide ()
    {
        if (exports.fadeOut)
        {
            $el.fadeOut(exports.duration, function () { script.resume() });
        } else
        {
            $el.hide();
            script.resume();
        }
    }

    exports.src = function (src) { video.load(asset.get(src)) };

    exports.stop = function () { video.stop() };

    exports.play = function () { video.play() };
});