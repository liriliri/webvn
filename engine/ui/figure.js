webvn.use(['ui', 'canvas', 'util', 'config', 'storage'], function (ui, canvas, util, config, storage) {
    "use strict";
    var exports = ui.create('figure', 'canvas');

    var conf = config.create('uiFigure');

    var asset = storage.createAsset(conf.get('path'), conf.get('extension'));

    var $el = exports.$el;
    $el.addClass('fill');

    var scene = canvas.createScene(exports.getCanvas());

    var figures = [],
        curFigure;

    curFigure = createFigure(0);

    function createFigure(num) {
        if (figures[num]) {
            return figures[num];
        }

        var figure = figures[num] = canvas.createImage();
        scene.add(figure);

        return figure;
    }

    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');
    exports.transition = conf.get('transition');

    exports.select = function (num) {
        curFigure = createFigure(num);
    };

    exports.scaleX = function (value) {
        curFigure.scaleX = value;
    };

    exports.scaleY = function (value) {
        curFigure.scaleY = value;
    };

    exports.scale = function (value) {
        curFigure.scaleX = curFigure.scaleY = value;
    };

    exports.alpha = function (value) {
        curFigure.alpha = value;
    };

    exports.filter = function (value) {
        curFigure.filter = value;
    };

    exports.hideFigure = function () {
        curFigure.fadeOut(exports.duration);
    };

    exports.load = function (src) {
        curFigure.transition = exports.transition;
        curFigure.load(asset.get(src), exports.duration);
    };

    exports.position = function (x, y) {
        curFigure.setPosition(x, y);
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

    exports.animate = function (to) {
        curFigure.animate(to, exports.duration);
    };

    var save = storage.create('figure');
    save.save(function (value) {
        // Save something here
    }).load(function (value) {
        // Restore something here
    });

});