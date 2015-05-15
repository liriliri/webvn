webvn.use(['ui', 'script', 'media', 'util', 'canvas', 'config'], function (ui, script, media, util, canvas, config) {
    "use strict";
    /**
     * @class webvn.ui.Menu
     */
    var exports = ui.create('menu', 'div');

    var conf = config.create('uiMenu');

    // Properties
    exports.bgm = null;
    exports.btnClickSound = null;
    exports.btnHoverSound = null;
    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');

    var bgm = media.createAudio('bgm'),
        sysAudio = media.createAudio('sys'),
        renderer = canvas.renderer;

    var tpl = ui.template.get('menu');
    var $el = exports.$el;
    $el.addClass('fill').html(tpl);

    exports.stopPropagation().events({
        'click .start': function () {
            renderer.start();
            if (exports.bgm) {
                bgm.stop();
            }
            if (exports.fadeOut) {
                $el.fadeOut(exports.duration, function () {
                    script.jump('start');
                });
            } else {
                $el.hide();
                script.jump('start');
            }
        },
        'click .load': function () {
            ui.get('save').show('load');
        },
        'click .setting': function () {
            ui.get('setting').show();
        },
        'click .cg': function () {
            ui.get('cg').show();
        },
        'click .music': function () {
            if (exports.bgm) {
                bgm.stop();
            }
            ui.get('music').show();
        },
        // Btn sound
        'mouseover li': function () {
            if (exports.btnHoverSound) {
                sysAudio.load(exports.btnHoverSound);
            }
        },
        'click li': function () {
            if (exports.btnClickSound) {
                sysAudio.load(exports.btnClickSound);
            }
        }
    });

    /**
     * Show Menu
     * @method webvn.ui.Menu#show
     */
    exports.show = function () {
        renderer.stop();
        if (exports.bgm) {
            bgm.load(exports.bgm);
        }
        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
    };

    /**
     * Decide which button should be displayed.
     * @method webvn.ui.Menu#btn
     * @param {object} buttons
     */
    exports.btn = function (buttons) {
        util.each(buttons, function (value, key) {
            var $e = $el.find('ul li.' + key);
            if (value === true) {
                $e.css('display', 'block');
            } else if (value === false) {
                $e.css('display', 'none');
            } else if (util.isString(value)) {
                $e.text(value);
            }
        });
    };

    exports.playBgm = function () {
        if (exports.bgm) {
            bgm.load(exports.bgm);
        }
    };

});