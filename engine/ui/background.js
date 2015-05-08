webvn.use(['ui', 'canvas', 'storage', 'config'], function (ui, canvas, storage, config) {
    "use strict";
    var exports = ui.create('background', 'canvas');

    var conf = config.create('uiBackground');

    var asset = storage.createAsset(conf.get('path'), conf.get('extension'));

    var $el = exports.$el;
    $el.addClass('fill');

    var image = canvas.createImage(),
        scene = new canvas.Scene(exports.getCanvas());

    scene.add(image);

    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');
    exports.transition = conf.get('transition');

    exports.load = function (src) {
        image.transition = exports.transition;
        image.load(asset.get(src), exports.duration);
    };

    exports.filter = function (value) {
        image.filter = value;
    };

    exports.scaleX = function (value) {
        image.scaleX = value;
    };

    exports.scaleY = function (value) {
        image.scaleY = value;
    };

    exports.scale = function (value) {
        image.scaleX = image.scaleY = value;
    };

    exports.position = function (x, y) {
        image.setPosition(x, y);
    };

    exports.animate = function (to) {
        image.animate(to, exports.duration);
    };

    exports.show = function () {
        canvas.renderer.add(scene);

        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
    };

    exports.hide = function () {
        canvas.renderer.remove(scene);

        if (exports.fadeOut) {
            $el.fadeOut(exports.duration);
        } else {
            $el.hide();
        }
    };

    var save = storage.create('background');
    save.save(function (value) {
        // Save something here
    }).load(function (value) {
        // Restore something here
    });

});