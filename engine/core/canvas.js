// Module canvas

webvn.add('canvas', ['class', 'loader', 'log', 'config', 'util', 'anim'], 
    function (s, kclass, loader, log, config, util, anim) {

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
    animate: function (properties, duration, ease) {

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
                    return;
                }

                self[key] = ease(0, time - start, origin[key], diff[key], duration);

            });

        }, 1000 / conf.get('fps'));

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
    render: function () {

        var self = this;

        if (!self.visible) {
            return;
        }

        if (self.isLoaded && self.parent) {
            var context = self.parent.context;
            context.drawImage(self.image, self.x, self.y, self.width, self.height);
        }

    }
});

canvas.Scene = kclass.create({
    // v is the canvas element
    constructor: function Scene(v) {

        this.view = v;
        this.order = null;
        this.context = this.view.getContext('2d');
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

        this.context.clearRect(0, 0, this.width, this.height);

    },
    getImageData: function () {

        return this.context.getImageData(0, 0, this.width, this.height);

    },
    putImageData: function (imageData) {

        this.context.putImageData(imageData);

    },
    remove: function (order) {

        this.children.splice(order, 1);

    },
    render: function () {

        // Remove every thing first
        this.clear();

        var children = this.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = this.children[i];
            child.render(this);
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