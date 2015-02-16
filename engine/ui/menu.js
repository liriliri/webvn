// Menu ui component

webvn.use(['ui'], function (s, ui) {

var menu = ui.create('menu', 'div'),
	$ele = menu.$ele;

$ele.addClass('fill');


var tpl = '<ul>' +
		'<li class="start-game">开始游戏</li>' +
		'<li class="load-game">读取存档</li>' +
		'<li class="setting">环境设定</li>' +
		'<li class="exit">游戏结束</li>' +
	'</ul>';

menu.body(tpl).event({
    'click .start-game': function () {

        console.log('Start game!');

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

menu.show();

});