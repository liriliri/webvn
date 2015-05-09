webvn.use(['script', 'ui'], function (script, ui) {
    var background = ui.get('background');

    /**
     * Background Command
     * @class webvn.cmd.BgCommand
     * @extends webvn.script.Command
     */
    script.createCommand({

        constructor: function BgCommand() {
            this.callSuper('bg');
        },

        options: {
            fadeIn: {
                type: 'Boolean',
                shortHand: 'fi'
            },
            fadeOut: {
                type: 'Boolean',
                shortHand: 'fo'
            },
            filter: {
                type: 'Json',
                shortHand: 'f'
            },
            position: {
                type: 'String',
                shortHand: 'pos'
            },
            x: {
                type: 'Number',
                shortHand: 'x'
            },
            y: {
                type: 'Number',
                shortHand: 'y'
            },
            animate: {
                type: 'Json',
                shortHand: 'a'
            },
            scaleX: {
                type: 'Number',
                shortHand: 'sx'
            },
            scaleY: {
                type: 'Number',
                shortHand: 'sy'
            },
            scale: {
                type: 'Number',
                shortHand: 'sc'
            },
            display: {
                type: 'Boolean',
                shortHand: 'd'
            },
            duration: {
                type: 'Number',
                shortHand: 'du'
            },
            transition: {
                type: 'String',
                shortHand: 't'
            },
            src: {
                type: 'String',
                shortHand: 's'
            },
            playNext: {
                type: 'Boolean',
                shortHand: 'pn',
                default: true
            }
        },

        orders: [
            'x',
            'y',
            'fadeIn',
            'fadeOut',
            'filter',
            'position',
            'duration',
            'animate',
            'scale',
            'scaleX',
            'scaleY',
            'transition',
            'display',
            'src',
            'playNext'
        ],

        fadeIn: function (value) {
            background.fadeIn = value;
        },

        fadeOut: function (value) {
            background.fadeOut = value;
        },

        filter: function (value) {
            background.filter(value);
        },

        position: function (value) {
            background.position(value);
        },

        x: function (value) {
            background.position(value);
        },

        y: function (value) {
            background.position(null, value);
        },

        animate: function (value) {
            background.animate(value);
        },

        scale: function (value) {
            background.scale(value);
        },

        scaleX: function (value) {
            background.scaleX(value);
        },

        scaleY: function (value) {
            background.scaleY(value);
        },

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
            background.transition = value;
        },

        src: function (value) {
            background.load(value);
        }

    });

});