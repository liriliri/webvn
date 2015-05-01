webvn.use(['script', 'ui'],
    function (script, ui) {
        var video = ui.get('video');
        /**
         * Video Command
         * @class webvn.cmd.VideoCommand
         * @extends webvn.script.Command
         */
        var Command = script.Command.extend({
            constructor: function VideoCommand() {
                this.callSuper('video');
            },
            /**
             * @memberof webvn.cmd.VideoCommand
             * @property {boolean} display(d) display or not
             * @property {string} click(c) stop or pause when clicked
             * @property {boolean} play(pl) play or pause
             * @property {string} src(s) load video and play
             */
            options: {
                display: {
                    type: 'Boolean',
                    shortHand: 'd'
                },
                click: {
                    type: 'String',
                    shortHand: 'c'
                },
                play: {
                    type: 'Boolean',
                    shortHand: 'pl'
                },
                src: {
                    type: 'String',
                    shortHand: 's'
                }
            },
            orders: [
                'display',
                'src',
                'play',
                'click'
            ],
            display: function (value) {
                "use strict";
                if (value) {
                    video.show();
                } else {
                    video.hide();
                }
            },
            src: function (value) {
                "use strict";
                video.src(value);
            },
            play: function (value) {
                "use strict";
                if (value) {
                    video.play();
                } else {
                    video.stop();
                }
            },
            click: function (value) {
                "use strict";
                video.clickAction(value);
            }
        });
        new Command;
    });