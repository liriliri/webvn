// Module webgl

webvn.add('webgl', ['class'], function (s, kclass) {

var webgl = {};

webgl.create = function (v, type) {

    switch (type) {
        case '2d':
            return new webgl.WebGL2D(v);
            break;
        default:
            break;
    }

};

var vec3 = {
    length: function(pt) {

        return Math.sqrt(pt[0] * pt[0] + pt[1] * pt[1] + pt[2] * pt[2]);

    },
    normalize: function(pt) {

        var d = Math.sqrt((pt[0] * pt[0]) + (pt[1] * pt[1]) + (pt[2] * pt[2]));
        if (d === 0) {
            return [0, 0, 0];
        }
        return [pt[0] / d, pt[1] / d, pt[2] / d];

    },
    dot: function(v1, v2) {

        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

    },
    angle: function(v1, v2) {

        return Math.acos((v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) / (Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]) * Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2])));

    },
    cross: function(vectA, vectB) {

        return [vectA[1] * vectB[2] - vectB[1] * vectA[2], vectA[2] * vectB[0] - vectB[2] * vectA[0], vectA[0] * vectB[1] - vectB[0] * vectA[1]];

    },
    multiply: function(vectA, constB) {

        return [vectA[0] * constB, vectA[1] * constB, vectA[2] * constB];

    },
    add: function(vectA, vectB) {

        return [vectA[0] + vectB[0], vectA[1] + vectB[1], vectA[2] + vectB[2]];

    },
    subtract: function(vectA, vectB) {

        return [vectA[0] - vectB[0], vectA[1] - vectB[1], vectA[2] - vectB[2]];

    },
    equal: function(a, b) {

        var epsilon = 0.0000001;
        if ((a === undefined) && (b === undefined)) {
            return true;
        }
        if ((a === undefined) || (b === undefined)) {
            return false;
        }

        return (Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon && Math.abs(a[2] - b[2]) < epsilon);

    }
};

var mat3 = {
    identity: [1.0, 0.0, 0.0,
               0.0, 1.0, 0.0,
               0.0, 0.0, 1.0],
    multiply: function (m1, m2) {

        var m10 = m1[0], m11 = m1[1], m12 = m1[2], m13 = m1[3], m14 = m1[4], m15 = m1[5], m16 = m1[6], m17 = m1[7], m18 = m1[8],
            m20 = m2[0], m21 = m2[1], m22 = m2[2], m23 = m2[3], m24 = m2[4], m25 = m2[5], m26 = m2[6], m27 = m2[7], m28 = m2[8];

        m2[0] = m20 * m10 + m23 * m11 + m26 * m12;
        m2[1] = m21 * m10 + m24 * m11 + m27 * m12;
        m2[2] = m22 * m10 + m25 * m11 + m28 * m12;
        m2[3] = m20 * m13 + m23 * m14 + m26 * m15;
        m2[4] = m21 * m13 + m24 * m14 + m27 * m15;
        m2[5] = m22 * m13 + m25 * m14 + m28 * m15;
        m2[6] = m20 * m16 + m23 * m17 + m26 * m18;
        m2[7] = m21 * m16 + m24 * m17 + m27 * m18;
        m2[8] = m22 * m16 + m25 * m17 + m28 * m18;

    },
    vec2_multiply: function (m1, m2) {
        
        var mOut = [];
        mOut[0] = m2[0] * m1[0] + m2[3] * m1[1] + m2[6];
        mOut[1] = m2[1] * m1[0] + m2[4] * m1[1] + m2[7];

        return mOut;

    },
    transpose: function (m) {

        return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];

    }
};

var STACK_DEPTH_LIMIT = 16;

var Transform = webgl.Transform = kclass.create({
    constructor: function Transform(mat) {

        return this.clearStack(mat);

    },
    clearStack: function(init_mat) {

        this.m_stack = [];
        this.m_cache = [];
        this.c_stack = 0;
        this.valid = 0;
        this.result = null;

        for (var i = 0; i < STACK_DEPTH_LIMIT; i++) {
            this.m_stack[i] = this.getIdentity();
        }

        if (init_mat !== undefined) {
            this.m_stack[0] = init_mat;
        } else {
            this.setIdentity();
        }

    },
    getIdentity: function() {

        return [1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0];

    },
    getResult: function() {

        if (!this.c_stack) {
            return this.m_stack[0];
        }

        var m = mat3.identity;

        if (this.valid > this.c_stack-1) { this.valid = this.c_stack-1; }

        for (var i = this.valid; i < this.c_stack+1; i++) {
            m = mat3.multiply(this.m_stack[i],m);
            this.m_cache[i] = m;
        }

        this.valid = this.c_stack-1;

        this.result = this.m_cache[this.c_stack];

        return this.result;

    },
    popMatrix: function() {

        if (this.c_stack === 0) { 
            return; 
        }
        this.c_stack--;

    },
    pushMatrix: function() {

        this.c_stack++;
        this.m_stack[this.c_stack] = this.getIdentity();

    },
    scale: function(x, y) {

        var scaleMatrix = this.getIdentity();

        scaleMatrix[0] = x;
        scaleMatrix[4] = y;

        mat3.multiply(scaleMatrix, this.m_stack[this.c_stack]);

    },
    setIdentity: function() {

        this.m_stack[this.c_stack] = this.getIdentity();
        if (this.valid === this.c_stack && this.c_stack) {
            this.valid--;
        }

    },
    translate: function(x, y) {

        var translateMatrix = this.getIdentity();

        translateMatrix[6] = x;
        translateMatrix[7] = y;

        mat3.multiply(translateMatrix, this.m_stack[this.c_stack]);

    }
});

/* Webgl filter
 * Inspired by WebGLImageFilter
 */
var Filter = webgl.Filter = kclass.create({
    constructor: function Filter(v) {

        this.view = v;
        this.gl = v.getContext('webgl');
        this.width = v.width;
        this.height = v.height;
        this.shaderPool = [];
        this.vertices = new Float32Array([
            -1, -1, 0, 1, 
            1, -1, 1, 1, 
            -1, 1, 0, 0,
            -1, 1, 0, 0, 
            1, -1, 1, 1,
            1, 1, 1, 0
        ]);

        this.init();

    },
    compileShader: function (source, type) {

        var gl = this.gl,
            shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        return shader;

    },
    /* Apply filter
     * Called after target is drawn
     */
    end: function () {

        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.emboss(1);

        var shaderProgram = this.shaderProgram;

        gl.uniform1f(this.shaderProgram.flipY, -1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(shaderProgram.pos);
        gl.enableVertexAttribArray(shaderProgram.uv);

        var floatSize = Float32Array.BYTES_PER_ELEMENT,
            vertSize = 4 * floatSize;
        gl.vertexAttribPointer(shaderProgram.pos, 2, gl.FLOAT, false, vertSize , 0 * floatSize);
        gl.vertexAttribPointer(shaderProgram.uv, 2, gl.FLOAT, false, vertSize, 2 * floatSize);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

    },
    getFragmentShaderSource: function (type) {

        return Filter.fragmentShader[type];

    },
    getVertexShaderSource: function () {

        return [
            'precision highp float;',
            'attribute vec2 pos;',
            'attribute vec2 uv;',
            'varying vec2 vUv;',
            'uniform float flipY;',
            'void main(void) {',
                'vUv = uv;',
                'gl_Position = vec4(pos.x, pos.y * flipY, 0.0, 1.0);',
            '}'
        ].join('\n');

    },
    init: function () {

        this.initTexture();
        this.initFramebuffer();

    },
    initFramebuffer: function () {

        var gl = this.gl,
            framebuffer = this.framebuffer = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // Bind texture to framebuffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    },
    // Init shader and cache
    initShader: function (type) {

        var gl = this.gl,
            storedShader = this.shaderPool[type];

        if (storedShader) { 
            gl.useProgram(storedShader);
            this.shaderProgram = storedShader;
            return storedShader;
        }

        var fs = this.compileShader(this.getFragmentShaderSource(type), gl.FRAGMENT_SHADER),
            vs = this.compileShader(this.getVertexShaderSource(), gl.VERTEX_SHADER);

        var shaderProgram = this.shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, fs);
        gl.attachShader(shaderProgram, vs);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        this.shaderPool[type] = shaderProgram;
        this.shaderProgram = shaderProgram;

        shaderProgram.pos = gl.getAttribLocation(shaderProgram, 'pos');
        shaderProgram.uv = gl.getAttribLocation(shaderProgram, 'uv');
        shaderProgram.flipY = gl.getUniformLocation(shaderProgram, 'flipY');

        this.vertexBuffer = gl.createBuffer();

        switch (type) {
            case 'colorMatrix':
                shaderProgram.m = gl.getUniformLocation(shaderProgram, 'm');
                break;
            case 'convolution':
                shaderProgram.m = gl.getUniformLocation(shaderProgram, 'm');
                shaderProgram.px = gl.getUniformLocation(shaderProgram, 'px');
                break;
            default:
                break;
        }

        return shaderProgram;

    },
    // Create texture for framebuffer
    initTexture: function () {

        var gl = this.gl,
            texture = this.texture = gl.createTexture();

        // Init texture settings
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    },
    /* Start the frameBuffer
     * Before target is drawn
     */
    start: function () {

        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        // Clear the texture
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

    },
    // Filters
    // ColorMatrix filters
    colorMatrix: function (matrix) {

        var gl = this.gl,
            m = new Float32Array(matrix);
        m[4] /= 255;
        m[9] /= 255;
        m[14] /= 255;
        m[19] /= 255;

        var shaderProgram = this.initShader('colorMatrix');
        gl.uniform1fv(shaderProgram.m, m);

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
    // Convolution filters
    convolution: function (matrix) {

        var gl = this.gl,
            m = new Float32Array(matrix),
            pixelSizeX = 1 / this.width,
            pixelSizeY = 1 / this.height;

        var shaderProgram = this.initShader('convolution');
        gl.uniform1fv(shaderProgram.m, m);
        gl.uniform2f(shaderProgram.px, pixelSizeX, pixelSizeY);

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
}, {
    fragmentShader: {
        colorMatrix: [
            'precision highp float;',
            'varying vec2 vUv;',
            'uniform sampler2D texture;',
            'uniform float m[20];',
            'void main(void) {',
                'vec4 c = texture2D(texture, vUv);',
                'gl_FragColor.r = m[0] * c.r + m[1] * c.g + m[2] * c.b + m[3] * c.a + m[4];',
                'gl_FragColor.g = m[5] * c.r + m[6] * c.g + m[7] * c.b + m[8] * c.a + m[9];',
                'gl_FragColor.b = m[10] * c.r + m[11] * c.g + m[12] * c.b + m[13] * c.a + m[14];',
                'gl_FragColor.a = m[15] * c.r + m[16] * c.g + m[17] * c.b + m[18] * c.a + m[19];',
            '}'
        ].join('\n'),
        convolution: [
            'precision highp float;',
            'varying vec2 vUv;',
            'uniform sampler2D texture;',
            'uniform vec2 px;',
            'uniform float m[9];',
            'void main(void) {',
                'vec4 c11 = texture2D(texture, vUv - px);',
                'vec4 c12 = texture2D(texture, vec2(vUv.x, vUv.y - px.y));',
                'vec4 c13 = texture2D(texture, vec2(vUv.x + px.x, vUv.y - px.y));',
                'vec4 c21 = texture2D(texture, vec2(vUv.x - px.x, vUv.y) );',
                'vec4 c22 = texture2D(texture, vUv);',
                'vec4 c23 = texture2D(texture, vec2(vUv.x + px.x, vUv.y) );',
                'vec4 c31 = texture2D(texture, vec2(vUv.x - px.x, vUv.y + px.y) );',
                'vec4 c32 = texture2D(texture, vec2(vUv.x, vUv.y + px.y) );',
                'vec4 c33 = texture2D(texture, vUv + px );',
                'gl_FragColor = ',
                    'c11 * m[0] + c12 * m[1] + c22 * m[2] +',
                    'c21 * m[3] + c22 * m[4] + c23 * m[5] +',
                    'c31 * m[6] + c32 * m[7] + c33 * m[8];',
                'gl_FragColor.a = c22.a;',
            '}',
        ].join('\n')
    }
});

/* 2d webgl functions
 * Inspired by webgl-2d
 */
var WebGL2D = webgl.WebGL2D = kclass.create({
    constructor: function WebGL2D(v) {

        this.view = v;
        this.gl = v.getContext('webgl');
        this.width = v.width;
        this.height = v.height;
        this.fs = undefined;
        this.vs = undefined;
        this.transform = new Transform();
        this.maxTextureSize = undefined;
        this.shaderPool = [];

        this.init();

    },
    clear: function () {

        var gl = this.gl;

        // Transprent
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

    },
    createProgram: function () {

        var gl = this.gl,
            program = gl.createProgram();

        gl.attachShader(program, this.vertexShader);
        gl.attachShader(program, this.fragmentShader);
        gl.linkProgram(program);

        return program;

    },
    drawImage: function (image, x, y) {

        var gl = this.gl;

        var transform = this.transform,
            sMask = WebGL2D.shaderMask.texture,
            doCrop = false;

        transform.pushMatrix();

        transform.translate(x, y);
        transform.scale(image.width, image.height);

        var sp = this.initShaders(transform.c_stack, sMask);

        var texture, cacheIndex = WebGL2D.imageCache.indexOf(image);

        if (cacheIndex !== -1) {
            texture = WebGL2D.textureCache[cacheIndex];
        } else {
            texture = new WebGL2D.Texture(gl, image);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.rectVertexPositionBuffer);
        gl.vertexAttribPointer(sp.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

        gl.bindTexture(gl.TEXTURE_2D, texture.obj);
        gl.activeTexture(gl.TEXTURE0);

        gl.uniform1i(sp.uSampler, 0);

        this.sendTransformStack(sp);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        transform.popMatrix();

    },
    getFragmentShaderSource: function (sMask) {

        return [
            '#ifdef GL_ES',
                'precision highp float;',
            '#endif',
            '#define hasTexture ' + ((sMask & WebGL2D.shaderMask.texture) ? '1' : '0'),
            '#define hasCrop ' + ((sMask & WebGL2D.shaderMask.crop) ? '1' : '0'),
            'varying vec4 vColor;',
            '#if hasTexture',
                'varying vec2 vTextureCoord;',
                'uniform sampler2D uSampler;',
                '#if hasCrop',
                    'uniform vec4 uCropSource;',
                '#endif',
            '#endif',
            'void main() {',
                '#if hasTexture',
                    '#if hasCrop',
                        'gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x * uCropSource.z, vTextureCoord.y * uCropSource.w) + uCropSource.xy);',
                    '#else',
                        'gl_FragColor = texture2D(uSampler, vTextureCoord);',
                    '#endif',
                '#else',
                    'gl_FragColor = vColor;',
                '#endif',
            '}'
        ].join('\n');

    },
    getVertexShaderSource: function (stackDepth, sMask) {

        var w = 2 / this.width, h = -2 / this.height;

        stackDepth = stackDepth || 1;

        return [
            '#define hasTexture ' + ((sMask & WebGL2D.shaderMask.texture) ? '1' : '0'),
            'attribute vec4 aVertexPosition;',
            '#if hasTexture',
            'varying vec2 vTextureCoord;',
            '#endif',
            'uniform vec4 uColor;',
            'uniform mat3 uTransforms[' + stackDepth + '];',
            'varying vec4 vColor;',
            'const mat4 pMatrix = mat4(' + w + ',0,0,0, 0,' + h + ',0,0, 0,0,1.0,1.0, -1.0,1.0,0,0);',
            'mat3 crunchStack() {',
                'mat3 result = uTransforms[0];',
                'for (int i = 1; i < ' + stackDepth + '; i++) {',
                    'result = uTransforms[i] * result;',
                '}',
                'return result;',
            '}',
            'void main() {',
                'vec3 position = crunchStack() * vec3(aVertexPosition.x, aVertexPosition.y, 1.0);',
                'gl_Position = pMatrix * vec4(position, 1.0);',
                'vColor = uColor;',
                '#if hasTexture',
                    'vTextureCoord = aVertexPosition.zw;',
                '#endif',
            '}'
        ].join('\n');

    },
    init: function () {

        var gl = this.gl;

        this.initShaders();
        this.initBuffers();

        gl.viewport(0, 0, this.width, this.height);
        this.clear();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    },
    initBuffers: function () {

        var gl = this.gl;

        this.rectVertexPositionBuffer = gl.createBuffer();
        this.rectVertexColorBuffer = gl.createBuffer();
        this.rectVerts = new Float32Array([
            0, 0, 0, 0,
            0, 1, 0, 1,
            1, 1, 1, 1,
            1, 0, 1, 0
        ]);
        this.pathVertexPositionBuffer = gl.createBuffer();
        this.pathVertexColorBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.rectVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.rectVerts, gl.STATIC_DRAW);

    },
    initShaders: function (transformStackDepth, sMask) {

        var gl = this.gl;

        transformStackDepth = transformStackDepth || 1;
        sMask = sMask || 0;

        var storedShader = this.shaderPool[transformStackDepth];
        if (!storedShader) { 
            storedShader = this.shaderPool[transformStackDepth] = []; 
        }
        storedShader = storedShader[sMask];

        if (storedShader) {
            gl.useProgram(storedShader);
            this.shaderProgram = storedShader;
            return storedShader;
        } else {
            var fs = this.fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(this.fs, this.getFragmentShaderSource(sMask));
            gl.compileShader(this.fs);

            var vs = this.vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(this.vs, this.getVertexShaderSource(transformStackDepth,sMask));
            gl.compileShader(this.vs);

            var shaderProgram = this.shaderProgram = gl.createProgram();
            shaderProgram.stackDepth = transformStackDepth;
            gl.attachShader(shaderProgram, fs);
            gl.attachShader(shaderProgram, vs);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);

            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.uColor   = gl.getUniformLocation(shaderProgram, 'uColor');
            shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, 'uSampler');
            shaderProgram.uCropSource = gl.getUniformLocation(shaderProgram, 'uCropSource');

            shaderProgram.uTransforms = [];
            for (var i = 0; i < transformStackDepth; ++i) {
                shaderProgram.uTransforms[i] = gl.getUniformLocation(shaderProgram, 'uTransforms[' + i + ']');
            }
            this.shaderPool[transformStackDepth][sMask] = shaderProgram;
            return shaderProgram;
        }

    },
    sendTransformStack: function (sp) {

        var gl = this.gl;
        var stack = this.transform.m_stack;
        for (var i = 0, maxI = this.transform.c_stack + 1; i < maxI; ++i) {
            gl.uniformMatrix3fv(sp.uTransforms[i], false, stack[maxI-1-i]);
        }

    }
}, {
    shaderMask: {
        texture: 1,
        crop: 2,
        path: 4
    },
    imageCache: [],
    textureCache: [],
    Texture: kclass.create({
        constructor: function Texture(gl, image) {

            this.obj   = gl.createTexture();
            this.index = WebGL2D.textureCache.push(this);

            WebGL2D.imageCache.push(image);

            // we may wish to consider tiling large images like this instead of scaling and
            // adjust appropriately (flip to next texture source and tile offset) when drawing
            if (image.width > this.maxTextureSize || image.height > this.maxTextureSize) {
                var canvas = document.createElement("canvas");

                canvas.width  = (image.width  > this.maxTextureSize) ? this.maxTextureSize : image.width;
                canvas.height = (image.height > this.maxTextureSize) ? this.maxTextureSize : image.height;

                var ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                image = canvas;
            }

            gl.bindTexture(gl.TEXTURE_2D, this.obj);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Enable Mip mapping on power-of-2 textures
            if (this.isPOT(image.width) && this.isPOT(image.height)) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

            // Unbind texture
            gl.bindTexture(gl.TEXTURE_2D, null);

        },
        isPOT: function (value) {
            return value > 0 && ((value - 1) & value) === 0;
        }
    })
});

return webgl;

});