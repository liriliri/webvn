webvn.use(['ui', 'text', 'media', 'config'], function (ui, text, media, config) {
    "use strict";
    var exports = ui.create('dialog', 'div');

    var conf = config.create('uiDialog');

    var $el = exports.$el;
    $el.addClass('fill');

    exports.textType = 'fadeIn';
    exports.textDuration = 50;
    exports.duration = 200;
    exports.fadeIn = true;
    exports.fadeOut = true;

    var tpl = ui.getTemplate('dialog');
    exports.body(tpl);

    var $content = $el.find('.content'),
        $name = $el.find('.name'),
        $text = $content.find('.text');

    exports.show = function () {
        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
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