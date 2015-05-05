webvn.use(['script', 'ui'], function (script, ui) {
    var background = ui.get('background');

    /**
     * Background Command
     * @class webvn.cmd.BgCommand
     * @extends webvn.script.Command
     */
    var Command = script.Command.extend({

        constructor: function BgCommand() {
            this.callSuper('bg');
        },

        options: {
            display: {
                type: 'Boolean',
                shortHand: 'd',
                desc: 'Whether the background is displayed'
            },
            duration: {
                type: 'Number',
                shortHand: 'du'
            },
            transition: {
                type: 'String',
                shortHand: 'trans'
            },
            src: {
                type: 'String',
                shortHand: 's',
                desc: 'Source of the current background image'
            }
        },

        orders: [
            'duration',
            'transition',
            'display',
            'src'
        ],

        display: function (value) {
            if (value) {
                background.show();
            } else {
                background.hide();
            }
        },

        duration: function (value) {
            background.duration = value;
        },

        transition: function (value) {
            background.transitionType(value);
        },

        src: function (value) {
            background.src(value);
        }

    });

    new Command;
});