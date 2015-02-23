/* Canvas module
 * Inspired by pixi.js
 */

webvn.add('canvas', ['class'], function (s, kclass) {

var canvas = {};

var BaseTextureCache = {},
    TextureCache = {};

// A texture stores the information that represents an image
canvas.BaseTexture = kclass.create({
    constructor: function BaseTexture(source) {

        this.width = 100;
        this.height = 100;
        this.hasLoaded = false;
        this.source = source;

        if (!source) {
            return;
        }

        if (this.source.complete && this.source.width && this.source.height) {
            this.hasLoaded = true;
            this.width = this.source.width;
            this.height = this.source.height;
        } else {
            var self = this;
            this.source.onload = function () {

                self.hasLoaded = true;
                self.width = self.source.width;
                self.height = self.source.height;

            };
        }

    }
}, {
    fromImage: function (imageUrl) {

        var baseTexture = BaseTextureCache[imageUrl];

        if (!baseTexture) {
            var image = new Image();
            image.src = imageUrl;
            baseTexture = new canvas.BaseTexture(image);
            baseTexture.imageUrl = imageUrl;
            BaseTextureCache[imageUrl] = baseTexture;
        }

        return baseTexture;

    }
});

// The base class for all objects that are rendered on the screen
canvas.DisplayObject = kclass.create({
    constructor: function DisplayObject() {

        this.alpha = 1;

    }
});

// A DisplayObjectContainer represents a collection of display objects
canvas.DisplayObjectContainer = canvas.DisplayObject.extend({
    constructor: function DisplayObjectContainer() {

        this.callSuper();
        this.children = [];

    },
    addChild: function (child) {

        return this.addChildAt(child, this.children.length);

    },
    addChildAt: function (child, index) {

        if (index >= 0 && index <= this.children.length) {

            this.children.splice(index, 0, child);

            return child;
        }

    }
});

// The CanvasRenderer draws the Scene and all its content onto a 2d canvas
canvas.Renderer = kclass.create({
    constructor: function Renderer(v) {

        this.view = v;

    }
});

// A Scene represents the root of the display tree. Everything connected to the stage is rendered
canvas.Scene = canvas.DisplayObjectContainer.extend({
    constructor: function Scene() {

        this.callSuper();

    }
});

// The Sprite object is the base for all textured objects that are rendered to the screen
canvas.Sprite = canvas.DisplayObjectContainer.extend({
    constructor: function Sprite() {

        this.callSuper();

    },
    _renderCanvas: function () {



    }
});

// A texture stores the information that represents an image or part of an image
canvas.Texture = kclass.create({
    constructor: function Texture() {



    }
});



return canvas;

});