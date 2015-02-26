// Background ui component

webvn.use(['ui', 'canvas'], function (s, ui, canvas) {

var background = ui.create('background', 'canvas'),
	$ele = background.$ele;
$ele.addClass('fill');

var image = new canvas.ImageEntity('/asset/test/bg1.png'),
    scene = new canvas.Scene(background.getCanvas());
scene.add(image);
canvas.renderer.add(scene)//.start();

background.src = function (src) {

    image.load(src);

};

});