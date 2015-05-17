/**
 * Manager of ui component
 * @namespace webvn.ui
 */
webvn.module('ui', function (Class, select, config, util, script, exports) {
    var conf = config.create('ui');
    var container = conf.get('container'),
        defaultTpl = conf.get('defaultTpl'),
        width = conf.get('width'),
        height = conf.get('height'),
        autoResize = conf.get('autoResize');

    var uis = {};

    exports.create = function (name, type) {
        var ui;

        switch (type) {
            case 'canvas':
                ui = new CanvasUi(name);
                break;
            default:
                ui = new DivUi(name);
                break;
        }

        uis[name] = ui;

        return ui;
    };

    exports.get = function (name) {
        return uis[name];
    };

    exports.template = Class.module(function (exports) {
        var templates = {};

        exports.create = function (name, content) {
            if (util.isObject(name)) {
                util.each(name, function (value, key) {
                    templates[key] = value;
                });
            } else {
                templates[name] = content;
            }
        };

        exports.get = function (name) {
            return templates[name];
        };
    });

    var $container = select.get(container);
    if ($container.length === 0) {
        select.get('body').append(defaultTpl);
    }
    $container = select.get(container);
    $container.css({
        width: width,
        height: height
    }).on('click', function () {
        // When the ui is clicked, execute the script
        script.play();
    });

    // Auto fill windows
    exports.scale = 1;

    var ratio = width / height;

    function resize() {
        var ww = window.innerWidth,
            wh = window.innerHeight;
            windowRatio = ww / wh;

        if (ratio > windowRatio) {
            exports.scale = ww / width;
        } else {
            exports.scale = wh / height;
        }

        // Zoom is better than transform scale
        $container.css('zoom', exports.scale);
    }

    if (autoResize) {
        window.onresize = function () {
            resize();
        };
        resize();
    }

    // Base class for all ui class
    var BaseUi = Class.create({

        constructor: function BaseUi(name) {
            this.init();
        },

        init: function () {
            this.$el.hide();
            $container.append(this.$el);
        },

        remove: function () {
            this.$el.remove();
        },

        show: function () {
            this.$el.show();
            return this;
        },

        hide: function () {
            this.$el.hide();
            return this;
        }
    });

    var DivUi = BaseUi.extend({

        constructor: function DivUi(name) {
            this.$el = select.create('div');
            this.$el.attr('id', name);

            this.callSuper();
        },

        stopPropagation: function () {
            this.$el.on('click', function (e) {
                e.stopPropagation();
            });

            return this;
        },

        events: function (type, fn) {
            var self = this,
                events = {};

            if (util.isObject(type)) {
                events = type;
            } else {
                events[type] = fn;
            }

            util.each(events, function (fn, type) {
                var parts = type.split(/\s/),
                    eventType = parts[0];
                parts.shift();
                var selector = parts.join(' ');
                // No propagation
                self.$el.on(eventType, selector, function (e) {
                    e.stopPropagation();
                    fn.call(this, e);
                });
            });

            return this;
        }

    });

    // Canvas element
    var CanvasUi = BaseUi.extend({

        constructor: function CanvasUi(name) {
            this.$el = select.create('canvas');
            this.$el.attr('id', name);
            this.canvas = this.$el.get(0);
            this.canvas.width = conf.get('width');
            this.canvas.height = conf.get('height');

            this.callSuper();
        },

        getCanvas: function () {
            return this.canvas;
        }

    });
});