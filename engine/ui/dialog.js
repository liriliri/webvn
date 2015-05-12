webvn.use(['ui', 'text', 'media', 'config', 'storage'], function (ui, text, media, config, storage) {
    "use strict";
    var exports = ui.create('dialog', 'div');

    var conf = config.create('uiDialog');

    var $el = exports.$el;
    $el.addClass('fill');

    exports.textType = conf.get('textType');
    exports.textDuration = conf.get('textDuration');
    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');

    var tpl = ui.getTemplate('dialog');
    exports.body(tpl);

    var $content = $el.find('.content'),
        $name = $el.find('.name'),
        $face = $el.find('.face'),
        $text = $content.find('.text');

    exports.show = function () {
        if ($el.visible()) {
            return;
        }
        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
    };

    $face.hide();

    var asset = storage.createAsset(conf.get('path'), conf.get('extension'));

    exports.face = function(src) {
        if (!src) {
            $face.hide();
        } else {
            $face.show().attr('src', asset.get(src));
        }
    };

    exports.hide = function () {
        if (exports.fadeOut) {
            $el.fadeOut(exports.duration);
        } else {
            $el.hide();
        }
    };

    exports.name = function (name) {
        $name.html('【' + name + '】');
    };

    var textAnim = text.createAnim($text);
    exports.text = function (text) {
        textAnim.type = exports.textType;
        textAnim.duration = exports.textDuration;
        textAnim.load(text);
    };

    var voice = media.createAudio('vo');
    exports.voice = function (src) {
        voice.load(src);
    };

    exports.style = function (name) {
        if (name === 'big') {
            $el.addClass('big');
        } else {
            $el.removeClass('big');
        }
    };

});