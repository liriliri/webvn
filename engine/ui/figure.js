/**
 * @namespace figure
 * @memberof ui
 */
WebVN.use(function (ui, canvas, util, config, storage)
{
    var uiName = 'figure',
        exports = ui.create(uiName, 'canvas'),
        $el = exports.$el,
        cvs = exports.getCanvas(),
        save = storage.create(uiName);

    var cfg = config.create('uiFigure'),
        cfgPath = cfg.get('path'),
        cfgExtension = cfg.get('extension');

    $el.addClass('fill');

    var asset = storage.asset.create(cfgPath, cfgExtension),
        scene = canvas.createScene(cvs),
        figures = [],
        curFigure;

    curFigure = createFigure(0);

    function createFigure(num)
    {
        if (figures[num]) return figures[num];

        var figure = figures[num] = canvas.createImage();
        scene.add(figure);

        return figure;
    }

    save.save(function ()
    {
        return {};
    }).load(function (val)
    {

    });

    exports.properties({
        duration: cfg.get('duration'),
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('fadeOut'),
        transition: cfg.get('transition'),
        select: {
            set: function (val) { curFigure = createFigure(val) }
        },
        scaleX: {
            set: function (val) { curFigure.scaleX = val }
        },
        scaleY: {
            set: function (val) { curFigure.scaleY = val }
        },
        scale: {
            set: function (val) { curFigure.scaleX = curFigure.scaleY = val }
        },
        alpha: {
            set: function (val) { curFigure.alpha = val }
        },
        filter: {
            set: function (val) { curFigure.filter = val }
        }
    });

    exports.hideFigure = function () { curFigure.fadeOut(exports.duration) };

    exports.load = function (src)
    {
        curFigure.transition = exports.transition;
        curFigure.load(asset.get(src), exports.duration);
    };

    exports.position = function (x, y) { curFigure.setPosition(x, y) };

    exports.show = function ()
    {
        canvas.renderer.add(scene);

        if ($el.visible()) return;

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    exports.hide = function ()
    {
        canvas.renderer.remove(scene);

        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };

    exports.animate = function (to) { curFigure.animate(to, exports.duration) };
});