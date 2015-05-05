webvn.use(['ui', 'canvas'], function (ui, canvas) {
    "use strict";
    var exports = ui.create('background', 'canvas'),
	    $el = exports.$el;

    $el.addClass('fill');

    var image = new canvas.ImageEntity(),
        scene = new canvas.Scene(exports.getCanvas());
    scene.add(image);
    canvas.renderer.add(scene);

    exports.duration = 300;

    exports.src = function (src) {
        image.load(src, exports.duration);
    };

    exports.show = function () {
        $el.fadeIn(exports.duration);
    };

    exports.transitionType = function (name) {
        image.transitionType = name;
    };

    exports.hide = function () {
        $el.fadeOut(exports.duration);
    };

});