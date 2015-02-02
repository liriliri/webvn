// Background ui component

webvn.use(['ui'], function (s, ui) {

var background = ui.create('background', 'div'),
	$ele = background.$ele;
$ele.addClass('fill');

var tpl = '<img src="/asset/test/bg1.png">';

background.setBody(tpl).show();

});