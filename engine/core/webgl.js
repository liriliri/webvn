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

// 2d webgl functions
webgl.WebGL2D = kclass.create({
    constructor: function WebGL2D(v) {

        this.view = v;
        this.gl = v.getContext('webgl');

        this.init();

    },
    clear: function () {

        var gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

    },
    drawImage: function (image, x, y) {



    },
    init: function () {

        var view = this.view,
            gl = this.gl;

        this.initShaders();
        this.initBuffers();

        gl.viewport(0, 0, view.width, view.height);
        this.clear();

    },
    initBuffers: function () {

        

    },
    initShaders: function () {

        

    }
}, {
    vertexShader: [
        'attribute vec2 a_position;',
        'void main() {',
        '    gl_Position = vec4(a_position, 0, 1);',
        '}'
    ].join('\n'),
    fragmentShader: [
        'void main() {',
        '    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);',
        '}'
    ].join('\n')
});

return webgl;

});