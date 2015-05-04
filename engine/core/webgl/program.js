webvn.extend('webgl', ['class', 'log', 'util'], function (exports, kclass, log, util) {

    var Shader = exports.Shader,
        createShader = exports.createShader,
        createTexture = exports.createTexture,
        Matrix4 = exports.Matrix4;

    var Program = exports.Program = kclass.create({

        constructor: function (gl) {
            this.gl = gl;
            this.value = gl.createProgram();

            this._initShader();
            this._initBuffer();
        },

        _initShader: function () {},

        _initBuffer: function () {},

        data: function (obj) {
            var self = this;

            util.each(obj, function (value, key) {
                "use strict";
                self[key] = value;
            });

            return this;
        },

        shader: function (shader) {
            var gl = this.gl;

            if (shader instanceof Shader) {
                shader = shader.value;
            }

            gl.attachShader(this.value, shader);

            return this;
        },

        uniform: function (name) {
            var gl = this.gl;

            var program = this.value;

            this[name] = gl.getUniformLocation(program, name);

            return this;
        },

        attribute: function (name) {
            var gl = this.gl;

            var program = this.value;

            this[name] = gl.getAttribLocation(program, name);

            return this;
        },

        link: function () {
            var gl = this.gl;

            var program = this.value;

            gl.linkProgram(program);

            var linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linkStatus) {
                var lastError = gl.getProgramInfoLog(program);
                log.error('Error in program linking: ' + lastError);
                gl.deleteProgram(program);
            }

            return this;
        },

        use: function () {
            var gl = this.gl;

            gl.useProgram(this.value);

            return this;
        },

        render: function () {}

    });

    exports.DrawImageProgram = Program.extend({

        constructor: function DrawImageProgram(gl, view) {
            this.width = view.width;
            this.height = view.height;
            this.textures = [];
            this.images = [];
            this.callSuper(gl);
        },

        _initShader: function () {
            var gl = this.gl;

            var fragShader = createShader(gl, 'frag');
            fragShader.source('drawImage');
            var vertexShader = createShader(gl, 'vertex');
            vertexShader.source('drawImage');

            this.shader(fragShader).shader(vertexShader).link().use();
            this.attribute('a_Position').uniform('u_Resolution').uniform('u_ModelMatrix');
        },

        _initBuffer: function () {
            var gl = this.gl;

            var u_Resolution = this.u_Resolution;
            gl.uniform2f(u_Resolution, this.width, this.height);

            var positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0, 0,
                0, 1,
                1, 1,
                1, 0
            ]), gl.STATIC_DRAW);

            var a_Position = this.a_Position;
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);

        },

        render: function (image, x, y) {
            var gl = this.gl;

            var modelMatrix = new Matrix4();
            modelMatrix.translate(x, y, 0);
            modelMatrix.scale(image.width, image.height, 1);
            var u_ModelMatrix = this.u_ModelMatrix;
            gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

            // Cache textures, makes a great improvement of performance.
            var texture = createTexture(gl, image);
            texture.active();

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

            return this;
        }

    });

});