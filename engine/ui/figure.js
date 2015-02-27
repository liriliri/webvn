// Module figure

webvn.use(['ui', 'canvas'], function (s, ui, canvas) {

var figure = ui.create('figure', 'canvas'),
    $el = figure.$el;

$el.addClass('fill');

var fg = new canvas.ImageEntity('/asset/test/fg1.png');

var scene = new canvas.Scene(figure.getCanvas());

scene.add(fg);
canvas.renderer.add(scene);

figure.src = function (src) {

    fg.load(src);

};

});