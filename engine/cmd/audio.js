webvn.use(['script', 'media'],
    function (s, script, media) {
        // Background music
        var bgm = media.getAudio('bgm');
        /**
         * Bgm Command
         * @class webvn.cmd.BgmCommand
         * @extends webvn.script.Command
         */
        var BgmCommand = script.Command.extend({
            constructor: function () {
                this.callSuper('bgm');
            },
            /**
             * @memberof webvn.cmd.BgmCommand
             * @property {number} duration(du) duration of fadein and fadeout
             * @property {boolean} fadeIn(fi) fade in bgm or not
             * @property {boolean} fadeOut(fo) fade out bgm or not
             * @property {boolean} loop(l) loop bgm or not
             * @property {boolean} play(p) play bgm or pause bgm
             * @property {string} src(s) load bgm and play
             * @property {boolean} stop(st) stop bgm
             * @property {number} volume(v) set volume of bgm
             */
            options: {
                duration: {
                    type: 'Number',
                    shortHand: 'du'
                },
                fadeIn: {
                    type: 'Boolean',
                    shortHand: 'fi'
                },
                fadeOut: {
                    type: 'Boolean',
                    shortHand: 'fo'
                },
                loop: {
                    type: 'Boolean',
                    shortHand: 'l'
                },
                play: {
                    type: 'Boolean',
                    shortHand: 'p'
                },
                src: {
                    type: 'String',
                    shortHand: 's'
                },
                stop: {
                    type: 'Boolean',
                    shortHand: 'st'
                },
                volume: {
                    type: 'Number',
                    shortHand: 'v'
                }
            },
            execution: function (values) {
                if (values.fadeIn === true) {
                    bgm.fadeIn = true;
                } else if (values.fadeIn === false) {
                    bgm.fadeIn = false;
                }
                if (values.fadeOut === true) {
                    bgm.fadeOut = true;
                } else if (values.fadeOut === false) {
                    bgm.fadeOut = false;
                }
                if (values.duration) {
                    bgm.duration = values.duration;
                }
                if (values.play === true) {
                    bgm.play();
                } else if (values.play === false) {
                    bgm.pause();
                }
                if (values.loop === true) {
                    bgm.loop(true);
                } else if (values.loop === false) {
                    bgm.loop(false);
                }
                if (values.stop === true) {
                    bgm.stop();
                }
                if (values.src) {
                    bgm.load(values.src);
                }
            }
        });
        new BgmCommand;

        /**
         * Se Command
         * @class webvn.cmd.SeCommand
         * @extends webvn.script.Command
         */
        // Sound Effect
        var se = media.getAudio('se');
        var SeCommand = script.Command.extend({
            constructor: function () {
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
                    shortHand: 'l'
                },
                src: {
                    type: 'String',
                    shortHand: 's'
                }
            },
            execution: function (values) {
                if (values.src) {
                    se.load(values.src);
                }
                if (values.loop === true) {
                    se.setloop(true);
                } else if (values.loop === false) {
                    se.setloop(false);
                }
            }
        });
        new SeCommand;

        // Voice
        var voice = media.getAudio('voice');
        /**
         * Voice Command
         * @class webvn.cmd.VoiceCommand
         * @extends webvn.script.Command
         */
        var VoiceCommand = script.Command.extend({
            constructor: function () {
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
                    shortHand: 'l'
                },
                src: {
                    type: 'String',
                    shortHand: 's'
                }
            },
            execution: function (values) {
                if (values.src) {
                    voice.load(values.src);
                }
                if (values.loop === true) {
                    voice.loop(true);
                } else if (values.loop === false) {
                    voice.loop(false);
                }
            }
        });
        new VoiceCommand;

    });
