webvn.use(function (script, media)
{
    var bgm = media.audio.get('bgm');

    script.command.create({

        /**
         * @class CmdBgm
         * @memberof command
         */
        constructor: function CmdBgm() {
            this.callSuper('bgm');
        },

        /**
         * @property {Object} options
         */
        options: {
            /**
             * @property {Number} options.duration
             */
            duration: {
                type: 'number',
                short: 'du'
            },
            /**
             * @property {Boolean} options.fadeIn
             */
            fadeIn: {
                type: 'boolean',
                short: 'fi'
            },
            fadeOut: {
                type: 'boolean',
                short: 'fo'
            },
            loop: {
                type: 'boolean',
                short: 'l'
            },
            play: {
                type: 'boolean',
                short: 'p'
            },
            src: {
                type: 'string',
                short: 's'
            },
            stop: {
                type: 'boolean',
                short: 'st'
            },
            volume: {
                type: 'number',
                short: 'v'
            },
            playNext: {
                type: 'boolean',
                short: 'pn',
                default: true
            }
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

        fadeIn: function (value) {
            bgm.fadeIn = value;
        },

        fadeOut: function (value) {
            bgm.fadeOut = value;
        },

        duration: function (value) {
            bgm.duration = value;
        },

        play: function (value) {
            value ? bgm.play() : bgm.pause();
        },

        loop: function (value) {
            bgm.loop(value);
        },

        stop: function (value) {
            value && bgm.stop();
        },

        src: function (value) {
            bgm.load(value);
        }

    });

    /**
     * Se Command
     * @class webvn.cmd.SeCommand
     * @extends webvn.script.Command
     */
    var se = media.audio.get('se');

    /**
     * @class CmdSe
     */
    script.command.create({

        constructor: function CmdSe() {
            this.callSuper('se');
        },

        /**
         * @memberof webvn.cmd.SeCommand
         * @property {Boolean} loop(l) loop bgm or not
         * @property {String} src(s) load bgm and play
         */
        options: {
            loop: {
                type: 'Boolean',
                short: 'l'
            },
            src: {
                type: 'String',
                short: 's'
            }
        },

        orders: [
            'src',
            'loop'
        ],

        src: function (value) {
            se.load(value);
        },

        loop: function (value) {
            se.loop(value);
        }

    });

    var voice = media.audio.get('voice');
    /**
     * Voice Command
     * @class webvn.cmd.VoiceCommand
     * @extends webvn.script.Command
     */
    script.command.create({

        constructor: function VoiceCommand() {
            this.callSuper('voice');
        },

        /**
         * @memberof webvn.cmd.VoiceCommand
         * @property {Boolean} loop(l) loop bgm or not
         * @property {String} src(s) load bgm and play
         */
        options: {
            loop: {
                type: 'Boolean',
                short: 'l'
            },
            src: {
                type: 'String',
                short: 's'
            }
        },

        orders: [
            'src',
            'loop'
        ],

        src: function (value) {
            voice.load(value);
        },

        loop: function (value) {
            voice.loop(value);
        }

    });

});
