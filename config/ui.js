webvn.extend('config', function (exports) {
    "use strict";

    exports.uiBackground = {
        path: 'asset/bgimage/',
        extension: 'jpg',
        duration: 300,
        fadeIn: true,
        fadeOut: true,
        transition: 'linear'
    };

    exports.uiFigure = {
        path: 'asset/fgimage/',
        extension: 'png',
        duration: 300,
        fadeIn: true,
        fadeOut: true,
        transition: 'linear'
    };

    exports.uiVideo = {
        path: 'asset/video/',
        extension: 'webm',
        duration: 300,
        fadeIn: false,
        fadeOut: false,
        clickAction: 'skip'
    };

    exports.uiDialog = {
        fadeIn: true,
        fadeOut: true,
        duration: 300,
        textType: 'fadeIn',
        textDuration: 50
    };

});