webvn.use(['config'], function (s, config) {
    /**
     * @name webvn.config.canvas
     * @property {number} fps
     */
    config.canvas = {
        fps: 60,
        duration: 200
    };

    config.script = {
        scenarios: [
            'init',
            'first'
        ],
        prefix: '/scenario/',
        fileType: 'wvn'
    };

    config.system = {
        title: 'WebVN'
    };

    config.ui = {
        container: '#webvn',
        width: 1280,
        height: 720
    };

    /**
     * @name webvn.config.log
     * @property {object} colors console colors
     */
    config.log = {
        colors: {
            info: '#07a',
            error: '#eb6864',
            warn: '#f9c621'
        }
    };

});