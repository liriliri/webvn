webvn.extend('webgl', ['class'], function (exports, kclass) {
    "use strict";

    var DrawImageProgram = exports.DrawImageProgram;

    var WebGL2D = exports.WebGL2D = kclass.create({

        constructor: function WebGL2D(view) {
            this.view = view;
            this.gl = view.getContext('webgl');
            this.width = view.width;
            this.height = view.height;

            this._init();
        },

        _init: function () {
            var gl = this.gl;

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this.drawImageProgram = new DrawImageProgram(this.gl, this.view);
        },

        drawImage: function (image, x, y) {
            this.drawImageProgram.use().render(image, x, y);
        },

        clear: function () {
            var gl = this.gl;

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

    });

    exports.create = function (view) {
        return new WebGL2D(view);
    };

});