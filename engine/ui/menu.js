webvn.use(['ui', 'script', 'media', 'util'],
    function (s, ui, script, media, util) {

        /**
         * @class webvn.ui.Menu
         */
        var exports = ui.create('menu', 'div');

        // Properties
        exports.bgm = null;
        exports.btnClickSound = null;
        exports.btnHoverSound = null;
        exports.duration = 1000;
        exports.fadeIn = true;
        exports.fadeOut = true;

        var bgm = media.createAudio('bgm'),
            sysAudio = media.createAudio('sys');

        var $el = exports.$el;
        $el.addClass('fill');

        var tpl = [
                '<ul>',
                    '<li class="start">开始游戏</li>',
                    '<li class="load">读取存档</li>',
                    '<li class="cg">图像鉴赏</li>',
                    '<li class="music">音乐鉴赏</li>',
                    '<li class="setting">环境设定</li>',
                '</ul>'
            ].join('');
        exports.body(tpl);

        exports.event({
            'click .start': function () {

                if (exports.bgm) {
                    bgm.stop();
                }

                if (exports.fadeOut) {
                    $el.fadeOut(exports.duration, function () {

                        script.resume();

                    });
                } else {
                    $el.hide();
                    script.resume();
                }

            },
            'click .load': function () {

                console.log('Load game!');

            },
            'click .setting': function () {

                console.log('setting');

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
            script.pause();
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

    });