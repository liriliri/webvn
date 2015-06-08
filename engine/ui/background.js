/**
 * @namespace background
 * @memberof ui
 */
WebVN.use(function (ui, canvas, storage, config)
{
    var uiName  = 'background',
        exports = ui.create(uiName, 'canvas'),
        $el     = exports.$el,
        cvs     = exports.getCanvas(),
        save    = storage.create(uiName);

    var cfg = config.create('uiBackground'),
        cfgPath = cfg.get('path'),
        cfgExtension = cfg.get('extension');

    $el.addClass('fill');

    var asset = storage.asset.create(cfgPath, cfgExtension),
        image = canvas.createImage(),
        scene = new canvas.Scene(cvs);

    scene.add(image);

    save.save(function () {
        return {};
    }).load(function (value) {
    });

    exports.properties({
        duration: cfg.get('duration'),
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('fadeOut'),
        transition: cfg.get('transition'),
        filter: {
            set: function (val) {
                image.filter = val;
            }
        },
        scaleX: {
            set: function (val) {
                image.scaleX = val;
            }
        },
        scaleY: {
            set: function (val) {
                image.scaleY = val;
            }
        },
        scale: {
            set: function (val) {
                image.scaleX = image.scaleY = val;
            }
        }
    });

    exports.load = function (src) {
        image.transition = exports.transition;
        image.load(asset.get(src), exports.duration);
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