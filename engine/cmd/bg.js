/**
 * @module command
 */
webvn.use(function (script, ui)
{
    var background = ui.get('background');

    script.command.create({

        /**
         * Background Command
         * @class CmdBg
         */
        constructor: function CmdBg()
        {
            this.callSuper('bg');
        },

        options: {
            fadeIn: {
                type: 'Boolean',
                short: 'fi'
            },
            fadeOut: {
                type: 'Boolean',
                short: 'fo'
            },
            filter: {
                type: 'Json',
                short: 'f'
            },
            position: {
                type: 'String',
                short: 'pos'
            },
            x: {
                type: 'Number',
                short: 'x'
            },
            y: {
                type: 'Number',
                short: 'y'
            },
            animate: {
                type: 'Json',
                short: 'a'
            },
            scaleX: {
                type: 'Number',
                short: 'sx'
            },
            scaleY: {
                type: 'Number',
                short: 'sy'
            },
            scale: {
                type: 'Number',
                short: 'sc'
            },
            display: {
                type: 'Boolean',
                short: 'd'
            },
            duration: {
                type: 'Number',
                short: 'du'
            },
            transition: {
                type: 'String',
                short: 't'
            },
            src: {
                type: 'String',
                short: 's'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn',
                default: true
            },
            waitTransition: {
                type: 'Boolean',
                short: 'wt'
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
            'waitTransition',
            'playNext'
        ],

        waitTransition: function (value, values) {
            if (values.src) {
                if (values.playNext) {
                    value && script.wait(background.duration);
                } else {
                    value && script.pause(background.duration);
                }
            }
        },

        fadeIn: function (value) {
            background.fadeIn = value;
        },

        fadeOut: function (value) {
            background.fadeOut = value;
        },

        filter: function (val) {
            background.filter = val;
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

        scale: function (val) {
            background.scale = val;
        },

        scaleX: function (val) {
            background.scaleX = val;
        },

        scaleY: function (val) {
            background.scaleY = val;
        },

        display: function (value) {
            value ? background.show() : background.hide();
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