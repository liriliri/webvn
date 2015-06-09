WebVN.use(function (script, ui)
{
    var video = ui.get('video');

    /**
     * Video Command
     * @class Video
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.Video.prototype */
        {
            constructor: function Video() { this.callSuper('video') },

            /**
             * @type {object}
             * @property {Boolean} display(d) Show or hide video.
             * @property {String} click(c) Stop or pause when clicked.
             * @property {Boolean} play(pl) Play or pause.
             * @property {String} source(src) Load video and play.
             * @property {Boolean} fadeIn(fi) Fade in or not.
             * @property {Boolean} fadeOut(fo) Fade out or not.
             * @property {Number} duration(du) Fade in, fade out duration.
             */
            options: {
                click   : { type: ['pause', 'click'],  short: 'c' },
                display : { type: 'Boolean', short: 'd' },
                fadeIn  : { type: 'String',  short: 'fi' },
                fadeOut : { type: 'String',  short: 'fo' },
                duration: { type: 'Number',  short: 'du' },
                play    : { type: 'Boolean', short: 'p' },
                source  : { type: 'String',  short: 'src'}
            },

            orders: [
                'duration',
                'fadeIn',
                'fadeOut',
                'display',
                'source',
                'play',
                'click'
            ],

            fadeIn  : function (val) { video.fadeIn = val },
            fadeOut : function (val) { video.fadeOut = val },
            display : function (val) { val && video.show() },
            duration: function (val) { video.duration = val },
            source  : function (val) { video.src(val) },
            play    : function (val) { val ? video.play() : video.stop() },
            click   : function (val) { video.clickAction = val }
        }
    );
});