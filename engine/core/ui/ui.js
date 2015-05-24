webvn.module('ui', function (Class, select, config, util, script, exports) {
    var cfg = config.create('ui'),
        cfgContainer = cfg.get('container'),
        cfgDefaultTpl = cfg.get('defaultTpl'),
        cfgWidth = cfg.get('width'),
        cfgHeight = cfg.get('height'),
        cfgAutoResize = cfg.get('autoResize');

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

    var $container = select.get(cfgContainer);
    if ($container.length === 0) {
        select.get('body').append(cfgDefaultTpl);
    }
    $container = select.get(cfgContainer);
    $container.css({
        width: cfgWidth,
        height: cfgHeight
    }).on('click', function () {
        // When the ui is clicked, execute the script
        script.play();
    });

    // Auto fill windows
    exports.scale = 1;

    var ratio = cfgWidth / cfgHeight;

    function resize() {
        var ww = window.innerWidth,
            wh = window.innerHeight,
            windowRatio = ww / wh;

        if (ratio > windowRatio) {
            exports.scale = ww / cfgWidth;
        } else {
            exports.scale = wh / cfgHeight;
        }

        // Zoom is better than transform scale
        $container.css('zoom', exports.scale);
    }

    if (cfgAutoResize) {
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

        properties: function (attrs) {
            var self = this;

            util.each(attrs, function (attr, key) {
                if (util.isObject(attr) && (attr['get'] || attr['set'])) {
                    Object.defineProperty(self, key, attr);
                } else {
                    self[key] = attr;
                }
            });

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
                    fn.call(select.get(this), e);
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
            this.canvas.width = cfgWidth;
            this.canvas.height = cfgHeight;

            this.callSuper();
        },

        getCanvas: function () {
            return this.canvas;
        }

    });
});