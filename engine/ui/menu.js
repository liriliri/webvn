// Menu ui component

webvn.use(['ui', 'script'], function (s, ui, script) {

var menu = ui.create('menu', 'div'),
	$el = menu.$el;

$el.addClass('fill');

menu.show = function () {

    script.pause();
    $el.fadeIn();

};

var tpl = '<ul>' +
		'<li class="start-game">开始游戏</li>' +
		'<li class="load-game">读取存档</li>' +
		'<li class="setting">环境设定</li>' +
		'<li class="exit">游戏结束</li>' +
	'</ul>';

menu.body(tpl).event({
    'click .start-game': function () {

        $el.fadeOut('fast', function () {

            script.resume();

        });

    },
    'click .load-game': function () {

        console.log('Load game!');

    },
    'click .setting': function () {

        console.log('setting');

    },
    'click .exit': function () {

        console.log('exit');

    }
});

});