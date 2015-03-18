// UI component figure

webvn.use(['ui', 'canvas', 'util'], 
    function (s, ui, canvas, util) {

var exports = ui.create('figure', 'canvas');
    
var $el = exports.$el;
$el.addClass('fill');

// Scene init
var scene = new canvas.Scene(exports.getCanvas());
canvas.renderer.add(scene);

// Figure container
var cache = [],
    currentFigure;

currentFigure = createFigure(0);

exports.select = function (num) {

    currentFigure = createFigure(num);

};

exports.src = function (src) {

    currentFigure.load(src);

};

exports.pos = function (x, y) {

    if (util.isString(x)) {
        var imageWidth = currentFigure.width,
            canvasWidth = scene.height;
        switch (x) {
            case 'center':
                currentFigure.x = (canvasWidth - imageWidth) / 2;
                break;
            case 'left':
                currentFigure.x = 0;
                break;
            case 'right':
                currentFigure.x = canvasWidth - imageWidth;
                break;
        }
        return;
    }

    if (x) {
        currentFigure.x = x;
    }
    if (y) {
        currentFigure.y = y;
    }

};

function createFigure(num) {

    if (cache[num]) {
        return cache[num];
    }

    var figure = cache[num] = new canvas.ImageEntity();

    scene.add(figure);

    return figure;

}

});