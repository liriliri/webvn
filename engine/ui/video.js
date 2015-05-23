webvn.use(function (ui, media, script, config, storage) {
    "use strict";
    var uiName = 'video',
        exports = ui.create('video', 'div'),
        $el = exports.$el,
        tpl = ui.template.get(uiName);

    var cfg = config.create('uiVideo'),
        cfgPath = cfg.get('path'),
        cfgExtension = cfg.get('extension');

    exports.clickAction = cfg.get('clickAction');
    exports.duration = cfg.get('duration');
    exports.fadeIn = cfg.get('fadeIn');
    exports.fadeOut = cfg.get('fadeOut');

    $el.addClass('fill').html(tpl());

    var asset = storage.createAsset(cfgPath, cfgExtension),
        video = media.video.create($el.find('video').get(0));

    exports.stopPropagation().events({

        'click video': function () {
            switch (exports.clickAction) {
                case 'skip':
                    video.stop();
                    hide();
                    break;
                case 'pause':
                    if (video.isPlaying()) {
                        video.pause();
                    } else {
                        video.play();
                    }
                    break;
            }
        }

    });


    video.events({

        ended: function () {
            hide();
        }

    });

    exports.play = function () {
        video.play();
    };

    exports.show = function () {
        if ($el.visible()) return;

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();

        script.pause();
    };

    function hide () {
        if (exports.fadeOut) {
            $el.fadeOut(exports.duration, function () {
                script.resume();
            });
        } else {
            $el.hide();
            script.resume();
        }
    }

    exports.src = function (src) {
        video.load(asset.get(src));
    };

    exports.stop = function () {
        video.stop();
    };

});