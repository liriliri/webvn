/**
 * Manager of ui component
 * @namespace webvn.ui
 */
webvn.module('ui', ['class', 'select', 'config', 'util', 'script'],
    function (s, kclass, select, config, util, script) {

        var conf = config.create('core-ui');
        conf.set(config.ui, false);

        var exports = {},
            cache = {}; // Store all the ui components

        var $container = select.get('#' + conf.get('container'));
        if ($container.length === 0) {
            select.get('body').append('<div class="center">'+
            '<div id="' + conf.get('container') + '"></div>' +
            '</div>');
        }
        $container = select.get('#' + conf.get('container'));

        // Init container width and height
        $container.css({
            width: conf.get('width'),
            height: conf.get('height')
        });

        // When the ui is clicked, execute the script
        $container.on('click', function () {
            script.play();
        });

        exports.scale = 1;
        // Auto fill windows
        var autoResize = conf.get('autoResize');
        if (autoResize) {
            window.onresize = function () {
                "use strict";
                resize();
            };
        }
        var width = conf.get('width'),
            height = conf.get('height'),
            ratio = width / height;
        function resize() {
            "use strict";
            var ww = window.innerWidth,
                wh = window.innerHeight;
            var scale;
            var windowRatio = ww / wh;
            if (ratio > windowRatio) {
                scale = ww / width;
            } else {
                scale = wh / height;
            }
            exports.scale = scale;
            // Zoom is better than transform scale
            $container.css('zoom', scale);
        }
        if (autoResize) {
            resize();
        }

        // Create and add ui component
        exports.create = function (name, type) {
            var newUi;
            switch (type) {
                case 'canvas':
                    newUi = new CanvasUi(name);
                    break;
                default:
                    newUi = new DivUi(name);
                    break;
            }
            cache[name] = newUi;
            return newUi;
        };

        // Get ui component for manipulation
        exports.get = function (name) {
            return cache[name];
        };

        // Base class for all ui class
        var BaseUi = kclass.create({
            constructor: function BaseUI(name) { },
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

        // Div element
        var DivUi = BaseUi.extend({
            constructor: function DivUI(name) {
                this.callSuper();
                this.$el = select.create('div');
                this.$el.attr('id', name);
                this.init();
            },
            // Set content
            body: function (html) {
                this.$el.html(html);
                return this;
            },
            // Bind events
            event: function (type, fn) {
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
                    self.$el.on(eventType, selector, fn);
                });
                return this;
            }
        });

        // Canvas element
        var CanvasUi = BaseUi.extend({
            constructor: function CanvasUi(name) {
                this.callSuper();
                this.$el = select.create('canvas');
                this.$el.attr('id', name);
                this.canvas = this.$el.get(0);
                this.canvas.width = conf.get('width');
                this.canvas.height = conf.get('height');
                this.init();
            },
            getCanvas: function () {
                return this.canvas;
            }
        });

        // UI Templates
        var templates = {};
        /**
         * @function webvn.ui.createTemplate
         * @param {string} name
         * @param {string} content
         */
        exports.createTemplate = function (name, content) {
            if (util.isObject(name)) {
                util.each(name, function (value, key) {
                    templates[key] = value;
                });
            } else {
                templates[name] = content;
            }
        };
        /**
         * @function webvn.ui.getTemplate
         * @param name
         * @returns {*}
         */
        exports.getTemplate = function (name) {
            return templates[name];
        };

        return exports;

    });