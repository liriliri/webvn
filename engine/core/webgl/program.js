webvn.extend('webgl', ['class', 'log', 'util', 'config'], function (exports, kclass, log, util, config) {

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

            if (config.build === 'release') {
                return this;
            }
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

            if (gl.curProgram === this.value) {
                return this;
            }
            gl.useProgram(this.value);
            gl.curProgram = this.value;

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

        render: function (image, x, y, alpha, scaleX, scaleY) {
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
            modelMatrix.scale(image.width * scaleX, image.height * scaleY, 1);
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

        attribute: function (name) {
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

            programs[type] = this.value = gl.createProgram();
            var fragShader = createShader(gl, 'frag');
            fragShader.source('trans_' + type);
            var vertexShader = createShader(gl, 'vertex');
            vertexShader.source('transition');

            this.shader(fragShader).shader(vertexShader).link().use();
            this.attribute('a_Position').uniform('resolution').uniform('progress').
                uniform('from').uniform('to');

            if (type === 'luma') {
                this.uniform('lumaTex');
            }

            this.positionBuffer = gl.createBuffer();

            return this;
        },

        render: function (texture1, texture2, progress, type, lumaImage) {
            var gl = this.gl;

            this.getProgram(type).use();

            var program = this.value;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);

            var a_Position = program.a_Position;
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 8, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.uniform2f(program.resolution, this.width, this.height);

            gl.uniform1f(program.progress, progress);

            texture1.active(0);
            gl.uniform1i(program.from, 0);

            texture2.active(1);
            gl.uniform1i(program.to, 1);

            if (type === 'luma') {
                var lumaTexture = createTexture(gl, lumaImage);
                lumaTexture.active(2);
                gl.uniform1i(program.lumaTex, 2);
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

    });

    exports.FilterProgram = Program.extend({

        constructor: function (gl, view) {
            this.gl = gl;
            this.values = {};
            this.width = view.width;
            this.height = view.height;
            this.positionData = new Float32Array([
                -1, -1, 0, 1,
                1, -1, 1, 1,
                -1, 1, 0, 0,
                -1, 1, 0, 0,
                1, -1, 1, 1,
                1, 1, 1, 0
            ]);
        },

        attribute: function (name) {
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

            programs[type] = this.value = gl.createProgram();
            var fragShader = createShader(gl, 'frag');
            fragShader.source(type);
            var vertexShader = createShader(gl, 'vertex');
            vertexShader.source('filter');

            this.shader(fragShader).shader(vertexShader).link().use();
            this.attribute('a_Position').attribute('a_Uv').uniform('m');

            if (type === 'convolution') {
                this.uniform('u_Px');
            }

            this.positionBuffer = gl.createBuffer();

            return this;
        },

        render: function (texture, type, value) {
            var gl = this.gl;

            this[type](value);

            var program = this.value;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);

            var a_Position = program.a_Position;
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(a_Position);

            var a_Uv = program.a_Uv;
            gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8);
            gl.enableVertexAttribArray(a_Uv);

            texture.active();

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        },

        colorMatrix: function (matrix) {
            var gl = this.gl,
                m = new Float32Array(matrix);

            m[4] /= 255;
            m[9] /= 255;
            m[14] /= 255;
            m[19] /= 255;

            this.getProgram('colorMatrix').use();

            var program = this.value;

            gl.uniform1fv(program.m, m);
        },

        brightness: function (brightness) {
            var b = (brightness || 0) + 1;
            this.colorMatrix([
                b, 0, 0, 0, 0,
                0, b, 0, 0, 0,
                0, 0, b, 0, 0,
                0, 0, 0, 1, 0
            ]);
        },

        saturation: function(amount) {
            var x = (amount || 0) * 2 / 3 + 1;
            var y = ((x - 1) * -0.5);
            this.colorMatrix([
                x, y, y, 0, 0,
                y, x, y, 0, 0,
                y, y, x, 0, 0,
                0, 0, 0, 1, 0
            ]);
        },

        desaturate: function() {
            this.saturation(-1);
        },

        contrast: function(amount) {
            var v = (amount || 0) + 1;
            var o = -128 * (v-1);

            this.colorMatrix([
                v, 0, 0, 0, o,
                0, v, 0, 0, o,
                0, 0, v, 0, o,
                0, 0, 0, 1, 0
            ]);
        },

        negative: function() {
            this.contrast(-2);
        },

        hue: function(rotation) {
            rotation = (rotation || 0)/180 * Math.PI;
            var cos = Math.cos(rotation),
                sin = Math.sin(rotation),
                lumR = 0.213,
                lumG = 0.715,
                lumB = 0.072;

            this.colorMatrix([
                lumR+cos*(1-lumR)+sin*(-lumR),lumG+cos*(-lumG)+sin*(-lumG),lumB+cos*(-lumB)+sin*(1-lumB),0,0,
                lumR+cos*(-lumR)+sin*(0.143),lumG+cos*(1-lumG)+sin*(0.140),lumB+cos*(-lumB)+sin*(-0.283),0,0,
                lumR+cos*(-lumR)+sin*(-(1-lumR)),lumG+cos*(-lumG)+sin*(lumG),lumB+cos*(1-lumB)+sin*(lumB),0,0,
                0, 0, 0, 1, 0
            ]);
        },

        desaturateLuminance: function() {
            this.colorMatrix([
                0.2764723, 0.9297080, 0.0938197, 0, -37.1,
                0.2764723, 0.9297080, 0.0938197, 0, -37.1,
                0.2764723, 0.9297080, 0.0938197, 0, -37.1,
                0, 0, 0, 1, 0
            ]);
        },

        sepia: function() {
            this.colorMatrix([
                0.393, 0.7689999, 0.18899999, 0, 0,
                0.349, 0.6859999, 0.16799999, 0, 0,
                0.272, 0.5339999, 0.13099999, 0, 0,
                0,0,0,1,0
            ]);
        },

        brownie: function() {
            this.colorMatrix([
                0.5997023498159715,0.34553243048391263,-0.2708298674538042,0,47.43192855600873,
                -0.037703249837783157,0.8609577587992641,0.15059552388459913,0,-36.96841498319127,
                0.24113635128153335,-0.07441037908422492,0.44972182064877153,0,-7.562075277591283,
                0,0,0,1,0
            ]);
        },

        vintagePinhole: function() {
            this.colorMatrix([
                0.6279345635605994,0.3202183420819367,-0.03965408211312453,0,9.651285835294123,
                0.02578397704808868,0.6441188644374771,0.03259127616149294,0,7.462829176470591,
                0.0466055556782719,-0.0851232987247891,0.5241648018700465,0,5.159190588235296,
                0,0,0,1,0
            ]);
        },

        kodachrome: function() {
            this.colorMatrix([
                1.1285582396593525,-0.3967382283601348,-0.03992559172921793,0,63.72958762196502,
                -0.16404339962244616,1.0835251566291304,-0.05498805115633132,0,24.732407896706203,
                -0.16786010706155763,-0.5603416277695248,1.6014850761964943,0,35.62982807460946,
                0,0,0,1,0
            ]);
        },

        technicolor: function() {
            this.colorMatrix([
                1.9125277891456083,-0.8545344976951645,-0.09155508482755585,0,11.793603434377337,
                -0.3087833385928097,1.7658908555458428,-0.10601743074722245,0,-70.35205161461398,
                -0.231103377548616,-0.7501899197440212,1.847597816108189,0,30.950940869491138,
                0,0,0,1,0
            ]);
        },

        polaroid: function() {
            this.colorMatrix([
                1.438,-0.062,-0.062,0,0,
                -0.122,1.378,-0.122,0,0,
                -0.016,-0.016,1.483,0,0,
                0,0,0,1,0
            ]);
        },

        shiftToBGR: function() {
            this.colorMatrix([
                0,0,1,0,0,
                0,1,0,0,0,
                1,0,0,0,0,
                0,0,0,1,0
            ]);
        },

        convolution: function (matrix) {
            var gl = this.gl,
                m = new Float32Array(matrix),
                pixelSizeX = 1 / this.width,
                pixelSizeY = 1 / this.height;

            this.getProgram('convolution').use();

            var program = this.value;

            gl.uniform1fv(program.m, m);
            gl.uniform2f(program.u_Px, pixelSizeX, pixelSizeY);
        },

        detectEdges: function() {
            this.convolution([
                0, 1, 0,
                1 -4, 1,
                0, 1, 0
            ]);
        },


        sharpen: function(amount) {
            var a = amount || 1;
            this.convolution([
                0, -1*a, 0,
                -1*a, 1 + 4*a, -1*a,
                0, -1*a, 0
            ]);
        },

        emboss: function(size) {
            var s = size || 1;
            this.convolution([
                -2*s, -1*s, 0,
                -1*s, 1, 1*s,
                0, 1*s, 2*s
            ]);
        }

    });

});