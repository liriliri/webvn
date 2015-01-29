// Background ui component

webvn.use(['ui'], function (s, ui) {

var background = ui.create('background', 'div');

var tpl = '<img src="/asset/test/bg1.png">' +
	'<div class="a"></div>';

background.setBody(tpl).show();

setTimeout(function () {
	TweenLite.to(background.$ele.find('.a'), 2, {
		width: 200,
		height: 200,
		color: 'red'
	});
}, 5000);

return background;

});