/* Canvas module
 * Inspired by pixi.js
 * Not going to use it since it is not that suitable for this project
 * May delete this module later
 */

webvn.add('canvas', ['class'], function (s, kclass) {

var canvas = {};

var BaseTextureCache = {},
    TextureCache = {};

canvas.Event = kclass.create({
    constructor: function (target, name, data) {

        this.__isEventObject = true;
        this.stopped = false;
        this.stoppedImmediate = false;
        this.target = target;
        this.type = name;
        this.data = data;
        this.timeStamp = Date.now();
        
    }
});

canvas.EventTarget = {
    mixin: function mixin(obj) {

        obj.emit = obj.dispatchEvent = function emit(eventName, data) {

            this._listeners = this._listeners || {};

            if(typeof eventName === 'object') {
                data = eventName;
                eventName = eventName.type;
            }

            if(!data || data.__isEventObject !== true) {
                data = new canvas.Event(this, eventName, data);
            }

            if(this._listeners && this._listeners[eventName]) {
                var listeners = this._listeners[eventName],
                    length = listeners.length,
                    fn = listeners[0],
                    i;

                for(i = 0; i < length; fn = listeners[++i]) {
                    fn.call(this, data);

                    if(data.stoppedImmediate) {
                        return this;
                    }
                }

                if(data.stopped) {
                    return this;
                }
            }

            if(this.parent && this.parent.emit) {
                this.parent.emit.call(this.parent, eventName, data);
            }

            return this;

        };

        obj.on = obj.addEventListener = function on(eventName, fn) {

            this._listeners = this._listeners || {};

            (this._listeners[eventName] = this._listeners[eventName] || []).push(fn);

            return this;

        };

        obj.off = obj.removeEventListener = function off(eventName, fn) {

            this._listeners = this._listeners || {};

            if(!this._listeners[eventName]) {
                return this;
            }

            var list = this._listeners[eventName],
                i = fn ? list.length : 0;

            while(i-- > 0) {
                if(list[i] === fn || list[i]._originalHandler === fn) {
                    list.splice(i, 1);
                }
            }

            if(list.length === 0) {
                delete this._listeners[eventName];
            }

            return this;

        };

    }
};

// The Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height
canvas.Rectangle = kclass.create({
    constructor: function Rectangle(x, y, width, height) {

        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;

    }
});

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

                self.dispatchEvent({type: 'loaded', content: self});

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

canvas.EventTarget.mixin(canvas.BaseTexture.prototype);

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

    },
    _renderCanvas: function (renderSession) {

        for (var i = 0, len = this.children.length; i < len; i++) {
            var child = this.children[i];
            child._renderCanvas(renderSession);
        }

    }
});

// The CanvasRenderer draws the Scene and all its content onto a 2d canvas
canvas.Renderer = kclass.create({
    constructor: function Renderer(v) {

        this.view = v;
        this.context = this.view.getContext('2d');

        this.renderSession = {
            context: this.context
        };

    },
    render: function (scene) {

        this.renderDisplayObject(scene);

    },
    renderDisplayObject: function (displayObject) {

        this.renderSession.context = this.context;
        displayObject._renderCanvas(this.renderSession);

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
    constructor: function Sprite(texture) {

        this.callSuper();

        this.texture = texture;

        this.renderable = true;

    },
    _renderCanvas: function (renderSession) {

        renderSession.context.drawImage(
            this.texture.baseTexture.source,
            this.texture.crop.x,
            this.texture.crop.y,
            this.texture.crop.width,
            this.texture.crop.height);

    }
});

// A texture stores the information that represents an image or part of an image
canvas.Texture = kclass.create({
    constructor: function Texture(baseTexture, frame, crop, trim) {

        this.noFrame = false;

        if (!frame) {
            this.noFrame = true;
            frame = new canvas.Rectangle(0, 0, 1, 1);
        }

        this.baseTexture = baseTexture;
        this.valid = false;
        this.width = 0;
        this.height = 0;

        this.crop = crop || new canvas.Rectangle(0, 0, 1, 1);

        if (baseTexture.hasLoaded) {
            if (this.noFrame) {
                frame = new canvas.Rectangle(0, 0, baseTexture.width, baseTexture.height);
            }
            this.setFrame(frame);
        } else {
            baseTexture.addEventListener('loaded', this.onBaseTextureLoaded.bind(this));
        }

    },
    onBaseTextureLoaded: function () {

        var baseTexture = this.baseTexture;
        baseTexture.removeEventListener('loaded', this.onLoaded);

        if (this.noFrame) {
            this.frame = new canvas.Rectangle(0, 0, baseTexture.width, baseTexture.height);
        }

        this.setFrame(this.frame);

    },
    setFrame: function (frame) {

        this.noFrame = false;
        this.frame = frame;
        this.width = frame.width;
        this.height = frame.height;

        this.crop.x = frame.x;
        this.crop.y = frame.y;
        this.crop.width = frame.width;
        this.crop.height = frame.height;

        this.valid = frame && frame.width && frame.height &&
            this.baseTexture.source && this.baseTexture.hasLoaded;

    }
}, {
    fromImage: function (imageUrl) {

        var texture = TextureCache[imageUrl];

        if (!texture) {
            texture = new canvas.Texture(canvas.BaseTexture.fromImage(imageUrl));
            TextureCache[imageUrl] = texture;
        }

        return texture;

    }
});

canvas.EventTarget.mixin(canvas.Texture.prototype);

return canvas;

});