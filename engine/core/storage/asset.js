webvn.extend('storage', function (exports, Class, config) {
    "use strict";

    var basePath = '';
    if (config.build === 'test') {
        basePath = '../';
    }

    var fileExt = /(jpg|png|bmp|ogg|webm|wav)$/;

    var Asset = exports.Asset = Class.create({

        constructor: function Asset(path, extension) {
            this.path = path || '';
            this.extension = extension || '';
        },

        get: function (src) {
            // If src ends with extension, do not modify it;
            if (fileExt.test(src)) {
                return basePath + src;
            }
            return basePath + this.path + src + '.' + this.extension;
        },

        setPath: function (str) {
            this.path = str;
        },

        setExtension: function (str) {
            this.extension = str;
        }

    });

    exports.createAsset = function (path, extension) {
        return new Asset(path, extension);
    };

});