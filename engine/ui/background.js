// Background ui component

webvn.use(['ui', 'canvas'], function (s, ui, canvas) {

var background = ui.create('background', 'canvas'),
	$el = background.$el;
    
$el.addClass('fill');

var image = new canvas.ImageEntity(),
    scene = new canvas.Scene(background.getCanvas());
scene.add(image);
canvas.renderer.add(scene);

background.src = function (src) {

    image.load(src, 2000);

};

});