webvn.extend('webgl', ['class', 'util'], function (exports, kclass, util) {
    "use strict";

    var createTexture = exports.createTexture;

    var FrameBuffer = exports.FrameBuffer = kclass.create({

        constructor: function FrameBuffer(gl, view) {
            this.gl = gl;
            this.width = view.width;
            this.height = view.height;
            this._init();
        },

        _init: function () {
            var gl = this.gl;

            var texture = this.texture = createTexture(gl);
            gl.bindTexture(gl.TEXTURE_2D, texture.value);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var frameBuffer = this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.value, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        },

        get: function () {
            return this.texture;
        },

        end: function () {
            var gl = this.gl;

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        },

        start: function () {
            var gl = this.gl;

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

    });

    var frameBuffers = {};

    exports.createFrameBuffer = function (gl, view, num) {
        var frameBuffer;
        if (!gl.fbId) {
            gl.fbId = util.guid('fb');
            frameBuffers[gl.fbId] = [];
        } else {
            frameBuffer = frameBuffers[gl.fbId][num];
            if (frameBuffer) {
                return frameBuffer;
            }
        }

        frameBuffer = new FrameBuffer(gl, view);
        frameBuffers[gl.fbId][num] = frameBuffer;

        return frameBuffer;
    };

});