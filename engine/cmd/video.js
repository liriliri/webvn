webvn.use(['script', 'ui'],
    function (s, script, ui) {
        var video = ui.get('video');
        /**
         * Video Command
         * @class webvn.cmd.VideoCommand
         * @extends webvn.script.Command
         */
        var Command = script.Command.extend({
            constructor: function () {
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
            execution: function (values) {
                if (values.display === true) {
                    video.show();
                } else if (values.display === false) {
                    video.hide();
                }
                if (values.src) {
                    video.src(values.src);
                }
                if (values.play === true) {
                    video.play();
                } else if (values.play === false) {
                    video.stop();
                }
                if (!values.click) {
                    values.click = 'stop';
                }
                video.clickAction(values.click);
            }
        });
        new Command;
    });