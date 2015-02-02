// Menu ui component

webvn.use(['ui'], function (s, ui) {

var menu = ui.create('menu', 'div'),
	$ele = menu.$ele;

$ele.addClass('fill');


var tpl = '<ul>' +
		'<li>开始游戏</li>' +
		'<li>读取存档</li>' +
		'<li>环境设定</li>' +
		'<li>游戏结束</li>' +
	'</ul>';

menu.setBody(tpl).show();

});