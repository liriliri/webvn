// Menu ui component

webvn.use(['ui', 'script', 'audio'], function (s, ui, script, audio) {

var menu = ui.create('menu', 'div'),
	$el = menu.$el,
    bgm = audio.create('bgm');

$el.addClass('fill');

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

    }
});

});