webvn.extend('config', function (exports) {

    exports.script = {
        scenarios: [
            'init',
            'first'
        ],
        path: 'scenario/',
        extension: 'wvn'
    };

    exports.system = {
        title: 'WebVN'
    };

    exports.ui = {
        container: '#webvn',
        defaultTpl: '<div class="center"><div id="webvn"></div></div>',
        width: 1280,
        height: 720,
        autoResize: true,
        lang: 'zh'
    };

    exports.log = {
        colors: {
            info: '#07a',
            error: '#eb6864',
            warn: '#f9c621'
        }
    };

    exports.media = {
        bgm: {
            path: 'asset/bgm/',
            extension: 'ogg',
            volume: 0.5
        },
        se: {
            path: 'asset/sound/',
            extension: 'ogg',
            volume: 0.5
        },
        vo: {
            path: 'asset/voice/',
            extension: 'ogg',
            volume: 0.5
        }
    };

    exports.canvas = {
        lumaPath: 'engine/img/luma/',
        lumaExtension: 'png'
    };

});