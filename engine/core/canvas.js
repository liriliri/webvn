// Module canvas

webvn.add('canvas', ['class', 'loader', 'log'], function (s, kclass, loader, log) {

var canvas = {};

canvas.Entity = kclass.create({
    constructor: function () {

        this.parent = null;
        this.order = null;

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
    constructor: function ImageEntity(source) {

        this.callSuper();

        var self = this;
        self.image = null;
        self.isLoaded = false;
        self.width = 0;
        self.height = 0;
        self.update = null;
        loader.image(source).then(function (image) {

            self.onLoad(image);

        });

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
        if (self.update) {
            self.update();
        }
        if (self.isLoaded && self.parent) {
            var context = self.parent.context;
            context.drawImage(self.image, 0, 0, self.width, self.height);
        }

    },
    update: function (fn) {

        this.update = fn;

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
    start: function () {

        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;
        requestAnim(this.render.bind(this));

    },
    stop: function () {

        this.isPaused = true;

    }
};

return canvas;

});