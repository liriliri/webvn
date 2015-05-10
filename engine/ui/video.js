webvn.use(['ui', 'media', 'script', 'config', 'storage'], function (ui, media, script, config, storage) {
    "use strict";
    var exports = ui.create('video', 'div');

    var conf = config.create('uiVideo');

    var asset = storage.createAsset(conf.get('path'), conf.get('extension'));

    var $el = exports.$el;
    $el.addClass('fill');

    var tpl = ui.getTemplate('video');
    exports.body(tpl);

    exports.event({
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

    exports.clickAction = conf.get('clickAction');
    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');

    var video = media.createVideo($el.find('video').get(0));

    video.event({
        ended: function () {
            hide();
        }
    });

    exports.play = function () {
        video.play();
    };

    exports.show = function () {
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
            $el.show();
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