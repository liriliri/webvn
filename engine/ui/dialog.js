webvn.use(['ui', 'text', 'media', 'config', 'storage'], function (ui, text, media, config, storage) {
    "use strict";
    var exports = ui.create('dialog', 'div');

    var conf = config.create('uiDialog');

    var tpl = ui.template.get('dialog');
    var $el = exports.$el;
    $el.addClass('fill').html(tpl());

    exports.textType = conf.get('textType');
    exports.textDuration = conf.get('textDuration');
    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');

    exports.events({

        'click .save': function () {
            ui.get('save').show('save');
        },

        'click .load': function () {
            ui.get('save').show('load');
        },

        'click .setting': function () {
            ui.get('setting').show();
        },

        'click .exit': function () {
            ui.get('menu').show();
        }

    });

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

    var voice = media.audio.get('vo');
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