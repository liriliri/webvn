webvn.extend('webgl', function (exports, Class, util) {
    "use strict";

    var Texture = exports.Texture = Class.create({

        constructor: function Texture(gl) {
            this.gl = gl;
            this.value = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.value);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        },

        image: function (image) {
            var gl = this.gl;

            var texture = this.value;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);

            return this;
        },

        active: function (num) {
            var gl = this.gl;

            if (num === undefined) {
                num = 0;
            }

            gl.activeTexture(gl.TEXTURE0 + num);
            gl.bindTexture(gl.TEXTURE_2D, this.value);
        }

    });

    var textures = {};

    exports.createTexture = function (gl, image) {
        if (image === undefined) {
            return new Texture(gl);
        }

        var texture;
        // Cache textures to improve performance.
        if (!gl.ttId) {
            gl.ttId = util.uid('tt');
            textures[gl.ttId] = {};
        } else {
            texture = textures[gl.ttId][image.src];
            if (texture) {
                return texture;
            }
        }

        texture = new Texture(gl);
        texture.image(image);
        textures[gl.ttId][image.src] = texture;

        return texture;
    };

});