// UI component dialog

webvn.use(['ui', 'text', 'media'], function (ui, text, media) {

    var exports = ui.create('dialog', 'div');

    exports.textType = 'fadeIn';
    exports.textDuration = 50;
    exports.duration = 200;
    exports.fadeIn = true;
    exports.fadeOut = true;

    var $el = exports.$el;
    $el.addClass('fill');

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

    var voice = media.createAudio('voice');
    exports.voice = function (voiceSouce) {

        voice.load(voiceSouce);

    };

});