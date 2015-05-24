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
        fadeOut: true,
        startLabel: 'start'
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

    exports.uiGallery = {
        path: 'asset/image/',
        extension: 'jpg',
        fadeIn: true,
        fadeOut: true,
        duration: 300,
        files: [
            ['cg1', 'cg2'],
            ['cg2', 'cg1'],
            'cg1',
            'cg2',
            'cg1',
            ['cg2', 'cg1'],
            'cg1',
            'cg2',
            'cg1',
            'cg2'
        ]
    };

    exports.uiMusic = {
        path: 'asset/bgm/',
        extension: 'ogg',
        fadeIn: true,
        fadeOut: true,
        duration: 300,
        files: [
            'bgm1',
            'bgm2'
        ]
    };

    exports.uiConfig = {
        fadeIn: true,
        fadeOut: true,
        duration: 300
    };

    exports.uiSave = {
        duration: 300,
        fadeIn: true,
        fadeOut: true,
        saveNum: 4
    };

});