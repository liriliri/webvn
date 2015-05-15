webvn.use(['ui', 'media', 'script', 'config', 'storage'], function (ui, media, script, config, storage) {
    "use strict";
    var exports = ui.create('video', 'div');

    var conf = config.create('uiVideo'),
        clickAction = conf.get('clickAction'),
        duration = conf.get('duration'),
        fadeIn = conf.get('fadeIn'),
        fadeOut = conf.get('fadeOut'),
        path = conf.get('path'),
        extension = conf.get('extension');

    var asset = storage.createAsset(path, extension);

    var tpl = ui.template.get('video');
    var $el = exports.$el;
    $el.addClass('fill').html(tpl);

    exports.clickAction = clickAction;
    exports.duration = duration;
    exports.fadeIn = fadeIn;
    exports.fadeOut = fadeOut;

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

    var video = media.createVideo($el.find('video').get(0));

    video.events({
        ended: function () {
            hide();
        }
    });

    exports.play = function () {
        video.play();
    };

    exports.show = function () {
        if ($el.visible()) {
            return;
        }

        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
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