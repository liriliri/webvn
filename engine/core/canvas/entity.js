webvn.extend('canvas', function (exports, Class, loader, anim, util, config, storage)
{
    var conf = config.create('canvas');

    var Entity = Class.create(
        {
            constructor: function Entity()
            {
                this.x = 0;
                this.y = 0;
                this.visible = false;
            },

            change: function () { return true },
            render: function () {}
        }
    );

    var lumaAsset = storage.createAsset(conf.get('lumaPath'), conf.get('lumaExtension'));

    var ImageEntity = exports.ImageEntity = Entity.extend(
        {
            constructor: function ImageEntity()
            {
                this.callSuper();

                this.alpha  = 1;
                this.width  = 0;
                this.height = 0;
                this.loaded = false;
                // Only when position is null, x and y will take effect.
                this.position   = null;
                this.progress   = 1;
                this.scaleX     = 1;
                this.scaleY     = 1;
                this.transition = 'linear';
                this.filter     = null;

                this.x2 = null;
                this.y2 = null;

                this.attributes = [
                    'x'       , 'y'     , 'alpha' , 'width'     , 'height', 'position',
                    'progress', 'scaleX', 'scaleY', 'transition', 'filter',
                    'x2'      , 'y2'
                ];
            },

            change: function ()
            {
                var attributes = this.attributes,
                    len        = attributes.length,
                    key, i;

                for (i = 0; i < len; i++)
                {
                    key = attributes[i];
                    if (this['_' + key] !== this[key])
                    {
                        this['_' + key] = this[key];
                        return true;
                    }
                }

                return false;
            },

            setPosition: function (x, y)
            {
                if (util.isString(x))
                {
                    this.position = x;
                    return;
                }

                this.position = null;
                if (x) this.x = x;
                if (y) this.y = y;
            },

            _calPosition: function (view)
            {
                var position = this.position;

                if (position === null) return;

                if (this._position === position) return;

                this._position = position;

                var w = view.width,
                    h = view.height;

                var image = this.image,
                    iw = image.width,
                    ih = image.height;

                switch (position)
                {
                    case 'c':
                    case 'center':
                        this.x = (w - iw) / 2; this.y = (h - ih) / 2; break;
                    case 'bc':
                    case 'bottomCenter':
                        this.x = (w - iw) / 2; this.y = h - ih; break;
                    case 'tc':
                    case 'topCenter':
                        this.x = (w - iw) / 2; this.y = 0; break;
                    case 'l':
                    case 'left':
                        this.x = 0; this.y = (h - ih) / 2; break;
                    case 'bl':
                    case 'bottomLeft':
                        this.x = 0; this.y = h - ih; break;
                    case 'tl':
                    case 'topLeft':
                        this.x = 0; this.y = 0; break;
                    case 'r':
                    case 'right':
                        this.x = w - iw; this.y = (h - ih) / 2; break;
                    case 'br':
                    case 'bottomRight':
                        this.x = w - iw; this.y = h - ih; break;
                    case 'tr':
                    case 'topRight':
                        this.x = w - iw; this.y = 0; break;
                }
            },

            animate: function (to, duration)
            {
                var ease;

                if (to.ease)
                {
                    ease = to.ease;
                    delete to.ease;
                }

                if (to.x !== undefined || to.y === undefined)
                {
                    this.position = null;
                }

                anim.create(this).to(to, duration, ease);
            },

            fadeIn: function (duration)
            {
                this.alpha   = 0;
                this.visible = true;

                anim.create(this).to({
                    alpha: 1
                }, duration);
            },

            fadeOut: function (duration)
            {
                var self = this;

                anim.create(this).to({
                    alpha: 0
                }, duration).call(function ()
                {
                    self.visible = false;
                });
            },

            load: function (src, duration)
            {
                var self = this;

                src = [src];

                // Handle situation
                if (util.startsWith(this.transition, 'luma'))
                {
                    var lumaType = this.transition.substr(4);
                    // Lowercase first character
                    lumaType = lumaType.charAt(0).toLowerCase() + lumaType.substr(1);
                    this.transition = 'luma';
                    src.push(lumaAsset.get(lumaType));
                }

                loader.image(src).then(function (images)
                {
                    var image;
                    if (util.isArray(images))
                    {
                        self.lumaImage = images[1];
                        image = images[0];
                    } else image = images;

                    if (self.image)
                    {
                        self.image2 = self.image;
                        self._load(image);
                    } else
                    {
                        self._load(image);
                        self.fadeIn(duration);
                        return;
                    }

                    self.progress = 0;
                    anim.create(self).to({
                        progress: 1
                    }, duration);
                });
            },

            _load: function (image)
            {
                this.image     = image;
                this.width     = image.width;
                this.height    = image.height;
                this._position = null;
            },

            render: function (scene)
            {
                var ctx = scene.ctx;

                if (this.progress !== 1 && this.x2 === null)
                {
                    // Store the last image x, y before recalculate position.
                    this.x2 = this.x;
                    this.y2 = this.y;
                }

                this._calPosition(scene.view);

                var image      = this.image,
                    x          = this.x,
                    y          = this.y,
                    alpha      = this.alpha,
                    scaleX     = this.scaleX,
                    scaleY     = this.scaleY,
                    transition = this.transition,
                    progress   = this.progress,
                    lumaImage  = this.lumaImage;

                if (progress !== 1)
                {
                    ctx.drawTransition(this.image2, image, progress, transition, this.x2, this.y2, x, y, alpha, scaleX, scaleY, this.filter, lumaImage);
                } else {
                    this.x2 = null;
                    var filter = this.filter;
                    if (filter) ctx.bufferFilter();
                    ctx.drawImage(image, x, y, alpha, scaleX, scaleY);
                    if (filter) ctx.drawFilter(filter.name, filter.value);
                }
            }
        }
    );

    exports.createImage = function () { return new ImageEntity };
});