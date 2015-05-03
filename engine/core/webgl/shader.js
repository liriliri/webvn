webvn.module('webgl', ['class', 'util'], function (kclass, util) {
    "use strict";
    var exports = {};

    exports.fragShader = kclass.module(function () {
        var exports = {};

        var shaders = {};

        exports.create = function (name, value) {
            if (util.isObject(name)) {
                util.each(name, function (value, key) {
                    shaders[key] = value;
                });
            } else {
                shaders[name] = value;
            }
        };

        exports.get = function (name) {
            return shaders[name];
        };

        return exports;
    });

    exports.vertexShader = kclass.module(function () {
        var exports = {};

        var shaders = {};

        exports.create = function (name, value) {
            if (util.isObject(name)) {
                util.each(name, function (value, key) {
                    shaders[key] = value;
                });
            } else {
                shaders[name] = value;
            }
        };

        exports.get = function (name) {
            return shaders[name];
        };

        return exports;
    });

    exports.Shader = kclass.create({

        constructor: function (gl, type) {
            this.gl = gl;
            if (type === 'frag') {
                this.value = gl.createShader(gl.FRAGMENT_SHADER);
            } else {
                this.value = gl.createShader(gl.VERTEX_SHADER);
            }
        },

        source: function (source) {
            var gl = this.gl;

            gl.shaderSource(this.value, source);
            gl.compileShader(this.value);
        }

    });

    return exports;
});