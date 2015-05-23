webvn.use(function (ui, canvas, util, config, storage) {
    "use strict";
    var uiName = 'figure',
        exports = ui.create(uiName, 'canvas'),
        $el = exports.$el,
        cvs = exports.getCanvas(),
        save = storage.create(uiName);

    var cfg = config.create('uiFigure'),
        cfgPath = cfg.get('path'),
        cfgExtension = cfg.get('extension');

    $el.addClass('fill');

    var asset = storage.createAsset(cfgPath, cfgExtension),
        scene = canvas.createScene(cvs),
        figures = [],
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

    save.save(function () {
        return {};
    }).load(function (value) {
    });

    exports.properties({
        duration: cfg.get('duration'),
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('fadeOut'),
        transition: cfg.get('transition')
    });

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

        if ($el.visible()) {
            return;
        }
        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
    };

    exports.hide = function () {
        canvas.renderer.remove(scene);

        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };

    exports.animate = function (to) {
        curFigure.animate(to, exports.duration);
    };



});