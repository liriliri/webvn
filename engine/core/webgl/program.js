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
        },

        _initShader: function () {},

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
            this.positionData = new Float32Array([
                0, 0,
                0, 1,
                1, 1,
                1, 0
            ]);

            this.callSuper(gl);
        },

        _initShader: function () {
            var gl = this.gl;

            var fragShader = createShader(gl, 'frag');
            fragShader.source('drawImage');
            var vertexShader = createShader(gl, 'vertex');
            vertexShader.source('drawImage');

            this.shader(fragShader).shader(vertexShader).link().use();
            this.attribute('a_Position').uniform('u_Resolution').uniform('u_ModelMatrix').uniform('u_Alpha');

            this.positionBuffer = gl.createBuffer();
        },

        render: function (image, x, y, alpha) {
            var gl = this.gl;

            var u_Resolution = this.u_Resolution;
            gl.uniform2f(u_Resolution, this.width, this.height);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);

            var a_Position = this.a_Position;
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);

            var u_Alpha = this.u_Alpha;
            gl.uniform1f(u_Alpha, alpha);

            var modelMatrix = new Matrix4();
            modelMatrix.translate(x, y, 0);
            modelMatrix.scale(image.width, image.height, 1);
            var u_ModelMatrix = this.u_ModelMatrix;
            gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

            var texture = createTexture(gl, image);
            texture.active();

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

            return this;
        }

    });

    exports.TransitionProgram = Program.extend({

        constructor: function TransitionProgram(gl, view) {
            this.gl = gl;
            var w = this.width = view.width;
            var h = this.height = view.height;
            this.values = {};
            this.positionData = new Float32Array([
                0, 0,
                w, 0,
                0, h,
                0, h,
                w, 0,
                w, h
            ]);
        },

        attriblue: function (name) {
            var gl = this.gl;

            var program = this.value;

            this.value[name] = gl.getAttribLocation(program, name);

            return this;
        },

        uniform: function (name) {
            var gl = this.gl;

            var program = this.value;

            this.value[name] = gl.getUniformLocation(program, name);

            return this;
        },

        getProgram: function (type) {
            var gl = this.gl;

            var programs = this.values;

            if (programs[type]) {
                this.value = programs[type];
                return this;
            }

            this.value = gl.createProgram();
            var fragShader = createShader(gl, 'frag');
            fragShader.source(type);
            var vertexShader = createShader(gl, 'vertex');
            vertexShader.source('transition');

            this.shader(fragShader).shader(vertexShader).link().use();
            this.attribute('a_Position').uniform('resolution').uniform('progress').
                uniform('from').uniform('to');

            this.positionBuffer = gl.createBuffer();

            return this;
        },

        render: function (texture1, texture2, progress, type) {
            var gl = this.gl;

            this.getProgram(type).use();

            var program = this.value;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);

            var a_Position = program.a_Position;
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 8, 0);
            gl.enableVertexAttribArray(a_Position);

            var resolution = program.resolution;
            gl.uniform2f(resolution, this.width, this.height);

            var progressLocation = program.progress;
            gl.uniform1f(progressLocation, progress);

            texture1.active(0);
            var from = program.from;
            gl.uniform1i(from, 0);

            texture2.active(1);
            var to = program.to;
            gl.uniform1i(to, 1);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

    });

});