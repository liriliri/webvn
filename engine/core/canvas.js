// Module canvas

webvn.add('canvas', ['class', 'loader', 'log', 'config', 'util', 'anim', 'webgl'], 
    function (s, kclass, loader, log, config, util, anim, webgl) {

var conf = config.create('core-canvas');
conf.set(config.global.canvas, false);

var canvas = {};

canvas.Entity = kclass.create({
    constructor: function () {

        this.parent = null;
        this.order = null;

        this.x = 0;
        this.y = 0;
        this.opacity = 1;
        this.visible = true;

    },
    animate: function (properties, duration, ease, cb) {

        duration = duration || conf.get('duration');

        if (util.isFunction(ease)) {
            cb = ease;
            ease = undefined;
        }

        var interval,
            self = this,
            start = +new Date,
            origin = {},
            diff = {},
            finish = start + duration,
            ease = ease || 'linear';

        ease = anim.ease[ease];

        util.each(properties, function (value, key) {

            origin[key] = self[key];
            diff[key] = value - origin[key];

        });

        interval = setInterval(function () {

            var time = +new Date;

            util.each(properties, function (value, key) {

                if (time > finish) {
                    clearInterval(interval);
                    if (cb) {
                        cb.call(self);
                    }
                    return;
                }

                self[key] = ease(0, time - start, origin[key], diff[key], duration);

            });

        }, 1000 / conf.get('fps'));

    },
    fadeIn: function (duration, cb) {

        if (!this.visible) {
            this.visible = true;
        }

        this.animate({
            opacity: 1
        }, duration, cb);

    },
    fadeOut: function (duration, cb) {

        this.animate({
            opacity: 0
        }, duration, function () {

            this.visible = false;

            if (cb) {  
                cb.call(this);
            }

        });

    },
    set: function (key, value) {

        var self = this;

        if (util.isObject(key)) {
            attrs = key;
        } else {
            (attrs = {})[key] = value;
        }

        util.each(attrs, function (value, key) {

            if (self[key]) {
                self[key] = value;
            }

        });

    },
    destroy: function () {

        if (this.parent) {
            this.parent.remove(this.order);
            this.parent = null;
            this.order = null;
        }

    },
    renderWrapper: function (caller) {

        var self = this,
            gl = caller.gl;

        if (!self.visible) {
            return;
        }

        self.render(gl);

    }
});

canvas.ImageEntity = canvas.Entity.extend({
    constructor: function ImageEntity() {

        this.callSuper();

        var self = this;

        self.image = null;
        self.isLoaded = false;
        self.width = 0;
        self.height = 0;

    },
    load: function (source) {

        var self = this;

        loader.image(source).then(function (image) {

            self.onLoad(image);

        });

    },
    onLoad: function (image) {

        var self = this;

        self.isLoaded = true;
        self.image = image;
        self.width = self.image.width;
        self.height = self.image.height;

    },
    render: function (gl) {

        var self = this;

        if (self.isLoaded && self.parent) {
            gl.drawImage(self.image, self.x, self.y);
        }

    }
});

canvas.Scene = kclass.create({
    // v is the canvas element
    constructor: function Scene(v) {

        this.view = v;
        this.order = null;
        this.filterData = {
            name: false,
            param: null
        };
        // this.context = this.view.getContext('2d');
        this.gl = webgl.create(this.view, '2d');
        this.width = this.view.width;
        this.height = this.view.height;
        this.children = [];

    },
    add: function (entity) {

        entity.order = this.children.length;
        entity.parent = this;
        this.children.push(entity);

    },
    clear: function () {

        this.gl.clear();

    },
    remove: function (order) {

        this.children.splice(order, 1);

    },
    filter: function (name, param) {

        this.filterData.name = name;
        if (param) {
            this.filterData.param = param;
        } else {
            this.filterData.param = null;
        }

    },
    render: function () {

        // Remove every thing first
        this.clear();

        var children = this.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = this.children[i];
            child.renderWrapper(this);
        }

    },
    renderFilter: function () {

        var name = this.filterData.name,
            param = this.filterData.param;

        if (!name) {
            return;
        }

        switch (name) {
            case 'grayscale':
                this.grayscale();
                break;
            default:
                break;
        }

    }
});

var requestAnim = window.requestAnimationFrame;

canvas.renderer = {
    isPaused: true,
    interval: 20,
    scenes: [],
    add: function (scene) {

        scene.order = this.scenes.length;
        this.scenes.push(scene);

        return this;

    },
    remove: function (order) {

        this.scenes.splice(order, 1);

    },
    render: function () {

        var scenes = this.scenes;

        if (this.isPaused) {
            return;
        }
        for (var i = 0, len = scenes.length; i < len; i++) {
            scenes[i].render();
        }
        requestAnim(this.render.bind(this));

    },
    fps: function (fps) {

        this.interval = Math.floor(1000 / fps);

        return this;

    },
    start: function () {

        var self = this;

        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;

        setTimeout(function () {

            requestAnim(self.render.bind(self));

        }, this.interval);

    },
    stop: function () {

        this.isPaused = true;

    }
};

canvas.renderer.fps(conf.get('fps')).
    start();

return canvas;

});