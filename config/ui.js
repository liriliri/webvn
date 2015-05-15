webvn.extend('config', function (exports) {
    "use strict";

    exports.uiBackground = {
        path: 'asset/bg/',
        extension: 'jpg',
        duration: 300,
        fadeIn: true,
        fadeOut: true,
        transition: 'linear'
    };

    exports.uiMenu = {
        duration: 300,
        fadeIn: true,
        fadeOut: true
    };

    exports.uiFigure = {
        path: 'asset/fg/',
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
        path: 'asset/face/',
        extension: 'png',
        fadeIn: true,
        fadeOut: true,
        duration: 300,
        textType: 'fadeIn',
        textDuration: 500
    };

    exports.uiCg = {
        path: 'asset/image/',
        extension: 'jpg',
        files: [
            'cg1',
            'cg2',
            'cg3',
            'cg4',
            'cg5',
            'cg6',
            'cg7',
            'cg8'
        ]
    };

    exports.uiMusic = {
        path: 'asset/bgm/',
        extension: 'ogg',
        files: [
            'bgm1',
            'bgm2',
            'Face Of Fact',
            'Kotoko - We Survive',
            '片雾烈火 - 红空恋歌',
            '霜月はるか - 恋狱'
        ]
    };

    exports.uiSave = {
        duration: 300,
        fadeIn: true,
        fadeOut: true,
        saveNum: 4
    };

});