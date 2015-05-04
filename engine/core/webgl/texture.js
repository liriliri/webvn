webvn.extend('webgl', ['class', 'util'], function (exports, kclass, util) {
    "use strict";

    var Texture = exports.Texture = kclass.create({

        constructor: function Texture(gl) {
            this.gl = gl;
            this.id = util.guid('texture');
            this.value = gl.createTexture();
        },

        image: function (image) {
            var gl = this.gl;

            var texture = this.value;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            gl.bindTexture(gl.TEXTURE_2D, null);

            return this;
        },

        active: function () {
            var gl = this.gl;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.value);
        }

    });

    var textures = {};

    exports.createTexture = function (gl, image) {
        var texture;
        // Cache textures to improve performance.
        if (!gl.id) {
            gl.id = util.guid('gl');
            textures[gl.id] = {};
        } else {
            texture = textures[gl.id][image.src];
            if (texture) {
                return texture;
            }
        }

        texture = new Texture(gl);
        texture.image(image);
        textures[gl.id][image.src] = texture;

        return texture;
    };

});