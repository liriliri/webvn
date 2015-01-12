// Background ui component

webvn.use(['ui'], function (s, ui) {

var background = ui.create('background', 'div');

background.setBody('<img src="http://pic2.zhimg.com/6198dbddf_m.jpg">').show();

return background;

});