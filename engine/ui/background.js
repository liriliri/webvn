webvn.use(function (ui, canvas, storage, config) {
    "use strict";
    var uiName = 'background',
        exports = ui.create(uiName, 'canvas'),
        $el = exports.$el,
        cvs = exports.getCanvas(),
        save = storage.create(uiName);

    var cfg = config.create('uiBackground'),
        cfgPath = cfg.get('path'),
        cfgExtension = cfg.get('extension');

    exports.duration = cfg.get('duration');
    exports.fadeIn = cfg.get('fadeIn');
    exports.fadeOut = cfg.get('fadeOut');
    exports.transition = cfg.get('transition');

    $el.addClass('fill');

    var asset = storage.createAsset(cfgPath, cfgExtension),
        image = canvas.createImage(),
        scene = new canvas.Scene(cvs);

    scene.add(image);

    save.save(function () {
        return {};
    }).load(function (value) {
    });

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

        if ($el.visible()) return;

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    exports.hide = function () {
        canvas.renderer.remove(scene);

        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };
});