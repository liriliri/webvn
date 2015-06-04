webvn.use(function (script, media)
{
    var audio   = media.audio,
        bgm     = audio.get('bgm'),
        se      = audio.get('se'),
        voice   = audio.get('voice'),
        command = script.command;

    /**
     * Background music command.
     * @class CmdBgm
     * @memberof script.command
     * @extends script.command.Command
     */
    command.create(
        /** @lends script.command.CmdBgm.prototype */
        {
            constructor: function CmdBgm() { this.callSuper('bgm'); },

            /**
             * @type {Object}
             * @property {number} duration(du) Fade in, fade out duration.
             */
            options: {
                duration: { type: 'number',  short: 'du' },
                fadeIn  : { type: 'boolean', short: 'fi' },
                fadeOut : { type: 'boolean', short: 'fo' },
                loop    : { type: 'boolean', short: 'l' },
                play    : { type: 'boolean', short: 'p' },
                src     : { type: 'string',  short: 's' },
                stop    : { type: 'boolean', short: 'st' },
                volume  : { type: 'number',  short: 'v' },
                playNext: { type: 'boolean', short: 'pn', default: true }
            },

            orders: [
                'fadeIn',
                'fadeOut',
                'duration',
                'play',
                'loop',
                'stop',
                'src',
                'playNext'
            ],

            fadeIn  : function (val) { bgm.fadeIn   = val; },
            fadeOut : function (val) { bgm.fadeOut  = val; },
            duration: function (val) { bgm.duration = val; },
            play    : function (val) { val ? bgm.play() : bgm.pause(); },
            loop    : function (val) { bgm.loop(val); },
            stop    : function (val) { val && bgm.stop(); },
            src     : function (val) { bgm.load(val); }
        }
    );

    /**
     * Sound effect Command
     * @class CmdSe
     * @memberof script.command
     * @extends script.command.Command
     */
    command.create(
        /** @lends script.command.CmdSe.prototype */
        {
            constructor: function CmdSe() { this.callSuper('se'); },

            /**
             * @type {Object}
             */
            options: {
                loop: { type: 'boolean', short: 'l' },
                src : { type: 'string',  short: 's' }
            },

            orders: [
                'src',
                'loop'
            ],

            src : function (val) { se.load(val); },
            loop: function (val) { se.loop(val); }
        }
    );

    /**
     * Voice Command
     * @class CmdVo
     * @memberof script.command
     * @extends script.command.Command
     */
    command.create(
        /** @lends script.command.CmdVo.prototype */
        {
            constructor: function CmdVo() { this.callSuper('voice'); },

            /**
             * @type {Object}
             */
            options: {
                loop: { type: 'boolean', short: 'l' },
                src : { type: 'string',  short: 's'}
            },

            orders: [
                'src',
                'loop'
            ],

            src : function (val) { voice.load(val); },
            loop: function (val) { voice.loop(val); }
        }
    );
});
