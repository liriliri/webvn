// Menu ui component

webvn.use(['ui', 'script', 'media'], function (s, ui, script, media) {

var menu = ui.create('menu', 'div'),
	$el = menu.$el,
    bgm = media.createAudio('bgm');

$el.addClass('fill');

var btnHoverSound = media.createAudio('btn'),
    btnSound = false;

menu.show = function () {

    script.pause();
    $el.fadeIn();

};

var tpl = '<ul>' +
		'<li class="start-game">开始游戏</li>' +
		'<li class="load-game">读取存档</li>' +
		'<li class="setting">环境设定</li>'
	'</ul>';

menu.body(tpl).event({
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
    'mouseover li': function () {

        if (btnSound) {
            btnHoverSound.stop();
            btnHoverSound.play();
        }

    }
});

menu.btnHoverSound = function (src) {

    btnSound = true;
    btnHoverSound.load(src, false);

};

});