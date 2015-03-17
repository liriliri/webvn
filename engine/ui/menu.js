// UI component menu ui

webvn.use(['ui', 'script', 'media', 'util'], 
    function (s, ui, script, media, util) {

var exports = ui.create('menu', 'div');

var $el = exports.$el;
$el.addClass('fill');

var bgm = media.createAudio('bgm'),
    sysAudio = media.createAudio('sys'),
    btnHoverSoundSrc = null,
    btnClickSoundSrc = null;

var tpl = [
        '<ul>',
            '<li class="start-game">开始游戏</li>',
            '<li class="load-game">读取存档</li>',
            '<li class="cg">CG鉴赏</li>',
            '<li class="music">音乐鉴赏</li>',
            '<li class="setting">环境设定</li>',
        '</ul>'
    ].join('\n');
exports.body(tpl);

exports.event({
    'click .start-game': function () {

        $el.fadeOut('fast', function () {

            bgm.stop();
            script.resume();

        });

    },
    'click .load-game': function () {

        console.log('Load game!');

    },
    'click .setting': function () {

        console.log('setting');

    },
    // Btn sound
    'mouseover li': function () {

        if (btnHoverSoundSrc) {
            sysAudio.load(btnHoverSoundSrc);
        }

    },
    'click li': function () {

        if (btnClickSoundSrc) {
            sysAudio.load(btnClickSoundSrc);
        }

    }
});

exports.show = function () {

    script.pause();
    $el.fadeIn();

};

exports.btnSound = function (src, type) {

    switch (type) {
        case 'click':
            btnClickSoundSrc = src;
            break;
        case 'hover':
            btnHoverSoundSrc = src;
            break;
    }

};

exports.bgm = function (src) {

    bgm.load(src);

};

exports.btn = function (buttons) {

    util.each(buttons, function (value, key) {

        var $e = $el.find('ul li.' + key);

        if (value) {
            $e.css('display', 'block');
        } else {
            $e.css('display', 'none');
        }

    });

};

});