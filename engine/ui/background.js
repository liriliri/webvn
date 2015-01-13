// Background ui component

webvn.use(['ui'], function (s, ui) {

var background = ui.create('background', 'div');

var tpl = '<img src="http://pic2.zhimg.com/6198dbddf_m.jpg">' +
	'<div class="a" style="background:#08c;width:20px;height:20px;"></div>';

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