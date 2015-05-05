webvn.extend('config', function (exports) {
    "use strict";

    exports.uiBackground = {
        path: 'asset/bgimage/',
        extension: 'jpg',
        duration: 300,
        fadeIn: true,
        transition: 'linear',
        fadeOut: true
    };

    exports.uiFigure = {
        path: 'asset/fgimage/',
        extension: 'png'
    };

    exports.uiVideo = {
        path: 'asset/video/',
        extension: 'webm'
    };

});