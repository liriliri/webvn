WebVN.module('webgl', function (exports, Class, util, log, config, module)
{
    exports.fragShader = module(function (exports)
    {
        var shaders = {};

        exports.create = function (name, value)
        {
            if (util.isObject(name))
            {
                util.each(name, function (value, key) { shaders[key] = value });
            } else
            {
                shaders[name] = value;
            }
        };

        exports.get = function (name) { return shaders[name] };
    });

    exports.vertexShader = module(function (exports)
    {
        var shaders = {};

        exports.create = function (name, value)
        {
            if (util.isObject(name))
            {
                util.each(name, function (value, key) { shaders[key] = value });
            } else
            {
                shaders[name] = value;
            }
        };

        exports.get = function (name) { return shaders[name] };
    });

    var Shader = exports.Shader = Class.create({

        constructor: function Shader(gl, type)
        {
            this.gl = gl;
            this.type = type;
            if (type === 'frag') {
                this.value = gl.createShader(gl.FRAGMENT_SHADER);
            } else {
                this.value = gl.createShader(gl.VERTEX_SHADER);
            }
        },

        source: function (source)
        {
            var gl = this.gl;

            if (exports[this.type + 'Shader'].get(source))
            {
                source = exports[this.type + 'Shader'].get(source);
            }

            gl.shaderSource(this.value, source);
            gl.compileShader(this.value);

            if (config.build === 'release') return;

            var compileStatus = gl.getShaderParameter(this.value, gl.COMPILE_STATUS);

            if (!compileStatus)
            {
                var lastError = gl.getShaderInfoLog(this.value);
                log.error('Error compiling shader: ' + lastError);
                gl.deleteShader(this.value);
            }
        }

    });

    exports.createShader = function (gl, type) { return new Shader(gl, type) };
});