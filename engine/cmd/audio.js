// Command bgm

webvn.use(['script', 'media'],
    function (s, script, media) {

        // Background music
        var bgm = media.getAudio('bgm');

        var BgmCommand = script.Command.extend({
            constructor: function () {

                var options = {
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
                };

                this.callSuper('bgm', options);

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

        // Sound Effect
        var se = media.getAudio('se');

        var SeCommand = script.Command.extend({
            constructor: function () {

                var options = {
                    loop: {
                        type: 'Boolean',
                        shortHand: 'l'
                    },
                    src: {
                        type: 'String',
                        shortHand: 's'
                    }
                };

                this.callSuper('se', options);

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

        var VoiceCommand = script.Command.extend({
            constructor: function () {

                var options = {
                    loop: {
                        type: 'Boolean',
                        shortHand: 'l'
                    },
                    src: {
                        type: 'String',
                        shortHand: 's'
                    }
                };

                this.callSuper('voice', options);

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

    });
