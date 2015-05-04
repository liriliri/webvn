webvn.extend('canvas', ['class', 'loader'], function (exports, kclass, loader) {

    var Entiy = kclass.create({

        constructor: function Entity() {
            "use strict";
            this.x = 0;
            this.y = 0;
            this.alpha = 1;
            this.visible = false;
            this.duration = 0;
        },

        render: function () {}

    });

    var ImageEntity = exports.ImageEntity = Entiy.extend({

        constructor: function ImageEntity() {
            this.callSuper();

            this.width = 0;
            this.height = 0;
            this.loaded = false;
            this.progress = 1;
        },

        load: function (src) {
            "use strict";
            var self = this;

            loader.image(src).then(function (image) {
                self._load(image);
            });
        },

        _load: function (image) {
            "use strict";
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.loaded = true;
        },

        render: function (scene) {
            "use strict";
            if (!this.loaded) {
                return;
            }

            var ctx = scene.ctx;

            var image = this.image,
                x = this.x,
                y = this.y;

            ctx.drawImage(image, x, y);
        }

    });

    exports.createImage = function () {
        return new ImageEntity;
    };

});