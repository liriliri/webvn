// Module figure

webvn.use(['ui', 'canvas'], function (s, ui, canvas) {

var figure = ui.create('figure', 'canvas'),
    $el = figure.$el;

$el.addClass('fill');

var fg = new canvas.ImageEntity();
    fg2 = new canvas.ImageEntity();

var scene = new canvas.Scene(figure.getCanvas());

scene.add(fg);
scene.add(fg2);

fg.x = 200
fg2.x = 600;
fg2.load('/asset/test/fg2.png');
canvas.renderer.add(scene);

figure.src = function (src) {

    fg.load(src);

};

});