webvn.extend('webgl', ['class'], function (exports, kclass) {
    "use strict";

    var Shader = exports.Shader,
        Program = exports.Program;

    exports.WebGL2D = kclass.create({

        constructor: function WebGL2D(view) {
            this.view = view;
            this.gl = view.getContext('webgl');

            this._initShader();
            this._initBuffer();
            this._initProgram();
        },

        _initShader: function () {
            var gl = this.gl;


        },

        _initBuffer: function () {

        },

        _initProgram: function () {

        },

        drawImage: function () {

        }

    });

    exports.create = function () {

    };

});