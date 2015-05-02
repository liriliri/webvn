webvn.extend('canvas', ['class', 'loader', 'anim'], function (exports, kclass, loader, anim) {

    var Entity = exports.Entity = kclass.create({
        constructor: function () {

            this.parent = null;
            this.order = null;

            this.x = 0;
            this.y = 0;
            this.alpha = 1;
            this.visible = false;

        },
        fadeIn: function (duration) {

            if (!this.visible) {
                this.visible = true;
            }

            duration = duration || 2000;

            anim.create(this).to({
                alpha: 1
            }, duration);

        },
        fadeOut: function (duration) {

            var self = this;

            duration = duration || 2000;

            anim.create(this).to({
                alpha: 0
            }, duration).call(function () {

                self.visible = false;

            });

        },
        set: function (key, value) {

            var self = this, attrs;

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
                gl = caller.gl,
                view = caller.view

            if (!self.visible) {
                return;
            }

            self.render(gl, view);

        }
    });

    exports.ImageEntity = Entity.extend({
        constructor: function ImageEntity() {

            this.callSuper();

            var self = this;

            self.image = null;
            self.isLoaded = false;
            self.width = 0;
            self.height = 0;
            // If process is not 1, it means transition executed
            self.progress = 1;

        },
        load: function (source, duration) {

            var self = this;

            loader.image(source).then(function (image) {

                if (!self.image) {
                    self.onLoad(image);
                }

                self.image2 = image;
                self.progress = 0;
                anim.create(self).to({
                    progress: 1
                }, duration).call(function () {

                    self.image = self.image2;

                });

            });

        },
        onLoad: function (image) {

            var self = this;

            self.isLoaded = true;
            self.image = image;
            self.width = self.image.width;
            self.height = self.image.height;

            self.visible = true;
            self.alpha = 0;
            self.fadeIn(300);

        },
        isTransition: function () {

            return this.progress !== 1;

        },
        render: function (gl) {

            var self = this;

            gl.save();
            gl.alpha = this.alpha;

            if (self.isLoaded && self.parent) {
                // Buffer image1
                if (self.isTransition()) {
                    gl.startBuffer(0);
                }
                gl.drawImage(self.image, self.x, self.y);
                // Buffer image2
                if (self.isTransition()) {
                    gl.endBuffer(0);
                    gl.startBuffer(1);
                    gl.drawImage(self.image2, self.x, self.y);
                    gl.endBuffer(1);
                    gl.drawTransition(gl.getBuffer(0), gl.getBuffer(1), 'circleOpen', self.progress);
                }
            }

            gl.restore();

        }
    });

});