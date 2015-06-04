webvn.use(function (script, ui)
{
    var video = ui.get('video');

    /**
     * Video Command
     * @class CmdVid
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.CmdVid.prototype */
        {
            constructor: function CmdVid() { this.callSuper('video') },

            /**
             * @type {object}
             * @property {boolean} display(d) display or not
             * @property {string} click(c) stop or pause when clicked
             * @property {boolean} play(pl) play or pause
             * @property {string} src(s) load video and play
             */
            options: {
                display : { type: 'Boolean', short: 'd' },
                fadeIn  : { type: 'String',  short: 'fi' },
                fadeOut : { type: 'String',  short: 'fo' },
                duration: { type: 'Number',  short: 'du' },
                click   : { type: 'String',  short: 'c' },
                play    : { type: 'Boolean', short: 'p' },
                src     : { type: 'String',  short: 's'}
            },

            orders: [
                'duration',
                'fadeIn',
                'fadeOut',
                'display',
                'src',
                'play',
                'click'
            ],

            fadeIn  : function (val) { video.fadeIn = val },
            fadeOut : function (val) { video.fadeOut = val },
            display : function (val) { val && video.show() },
            duration: function (val) { video.duration = val },
            src     : function (val) { video.src(val) },
            play    : function (val) { val ? video.play() : video.stop() },
            click   : function (val) { video.clickAction = val }
        }
    );
});