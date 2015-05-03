webvn.extend('webgl', ['class'], function (exports, kclass) {
    "use strict";

    exports.Program = kclass.create({

        constructor: function (gl) {
            this.gl = gl;
        }

    });

});