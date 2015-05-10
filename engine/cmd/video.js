webvn.use(['script', 'ui'], function (script, ui) {
    var video = ui.get('video');

    /**
     * Video Command
     * @class webvn.cmd.VideoCommand
     * @extends webvn.script.Command
     */
    script.createCommand({

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
            fadeIn: {
                type: 'String',
                shortHand: 'fi'
            },
            fadeOut: {
                type: 'String',
                shortHand: 'fo'
            },
            duration: {
                type: 'Number',
                shortHand: 'du'
            },
            click: {
                type: 'String',
                shortHand: 'c'
            },
            play: {
                type: 'Boolean',
                shortHand: 'p'
            },
            src: {
                type: 'String',
                shortHand: 's'
            }
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

        fadeIn: function (value) {
            video.fadeIn = value;
        },

        fadeOut: function (value) {
            video.fadeOut = value;
        },

        display: function (value) {
            if (value) {
                video.show();
            }
        },

        duration: function (value) {
            video.duration = value;
        },

        src: function (value) {
            video.src(value);
        },

        play: function (value) {
            if (value) {
                video.play();
            } else {
                video.stop();
            }
        },

        click: function (value) {
            video.clickAction = value;
        }

    });
});