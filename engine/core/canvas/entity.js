webvn.extend('canvas', ['class', 'loader', 'anim'], function (exports, kclass, loader, anim) {

    var Entiy = kclass.create({

        constructor: function Entity() {
            "use strict";
            this.x = 0;
            this.y = 0;
            this.visible = false;
        },

        render: function () {}

    });

    var ImageEntity = exports.ImageEntity = Entiy.extend({

        constructor: function ImageEntity() {
            this.callSuper();

            this.alpha = 1;
            this.width = 0;
            this.height = 0;
            this.loaded = false;
            this.progress = 1;
            this.transitionType = 'linearBlur';
        },

        fadeIn: function (duration) {
            this.alpha = 0;
            this.visible = true;
            anim.create(this).to({
                alpha: 1
            }, duration);
        },

        load: function (src, duration) {
            "use strict";
            var self = this;

            loader.image(src).then(function (image) {
                if (self.image) {
                    self.image2 = self.image;
                    self._load(image);
                } else {
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

        _load: function (image) {
            "use strict";
            this.image = image;
            this.width = image.width;
            this.height = image.height;
        },

        render: function (scene) {
            "use strict";
            if (!this.visible) {
                return;
            }

            var ctx = scene.ctx;

            var image = this.image,
                x = this.x,
                y = this.y,
                alpha = this.alpha,
                transitionType = this.transitionType,
                progress = this.progress;

            if (progress !== 1) {
                ctx.drawTransition(this.image2, image, progress, transitionType, x, y, alpha);
            } else {
                ctx.drawImage(image, x, y, alpha);
            }
        }

    });

    exports.createImage = function () {
        return new ImageEntity;
    };

});