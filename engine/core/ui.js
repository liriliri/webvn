// Manager of ui component

webvn.add('ui', ['class', 'select', 'config', 'util'], 
    function (s, kclass, $, config, util) {

// Default config
var defaults = {
    container: 'body'
};

var conf = config.create('core-ui');
conf.set(defaults).set(config.global.ui, true);

var ui = {},
    cache = {}, // Store all the ui components
    $container = $('#webvn');

// Init container width and height
$container.css({
    width: conf.get('width'),
    height: conf.get('height')
});

// Create and add ui component
ui.create = function (name, type) {

    var newUi;

    switch (type) {
        case 'canvas':
            newUi = new CanvasUi(name);
            break;
        case 'svg':
            newUi = new SvgUi(name);
            break;
        default:
            newUi = new DivUi(name);
            break;
    }

    cache[name] = newUi;

    return newUi;

};

// Get ui component for manipulation
ui.get = function (name) {

    return cache[name];

};

// Base class for all ui class
var BaseUi = kclass.create({
    constructor: function BaseUI(name) {

    },
    init: function () {

        this.$ele.hide();
        $container.append(this.$ele);

    },
    remove: function () {

        this.ele.remove();

    },
    show: function () {

        this.$ele.show();

        return this;

    }
});

// Div element
var DivUi = BaseUi.extend({
    constructor: function DivUI(name) {

        this.callSuper();
        this.$ele = $('<div id="' + name + '">');
        this.init();

    },
    // Set content
    body: function (html) {

        this.$ele.html(html);

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

            var parts = type.split(/\s/);

            self.$ele.on(parts[0], parts[parts.length - 1], fn);

        });

        return this;

    }
});

// Canvas element
var CanvasUi = BaseUi.extend({
    constructor: function CanvasUi(name) {

        this.callSuper();
        this.$ele = $('<canvas id="' + name + '">');
        this.ctx = this.$ele[0].getContext('2d');

    },
    // 获取2d绘图对象
    getContext2d: function () {

        return this.ctx;

    }
});

// Svg element
var SvgUi = BaseUi.extend({

    constructor: function SvgUi(name) {

        this.callSuper();
        this.$ele = $('<svg id="' + name + '">');

    }

});

return ui;

});