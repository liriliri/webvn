/**
 * @module command
 */
webvn.use(function (script, ui)
{
    var figure = ui.get('figure');

    /**
     * @class FgCmd
     */
    script.command.create({

        /**
         * @constructor
         */
        constructor: function FgCmd()
        {
            this.callSuper('fg');
        },

        options: {
            filter: {
                type: 'Json',
                short: 'f'
            },
            hide: {
                type: 'Boolean',
                short: 'h'
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
            fadeIn: {
                type: 'Boolean',
                short: 'fi'
            },
            fadeOut: {
                type: 'Boolean',
                short: 'fo'
            },
            display: {
                type: 'Boolean',
                short: 'd'
            },
            alpha: {
                type: 'Number',
                short: 'al'
            },
            duration: {
                type: 'Number',
                short: 'du'
            },
            select: {
                type: 'Number',
                short: 'sel'
            },
            transition: {
                type: 'String',
                short: 't'
            },
            src: {
                type: 'String',
                short: 's'
            },
            x: {
                type: 'Number',
                short: 'x'
            },
            y: {
                type: 'Number',
                short: 'y'
            },
            position: {
                type: 'String',
                short: 'pos'
            },
            animate: {
                type: 'Json',
                short: 'a'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn',
                default: true
            }
        },

        orders: [
            'fadeIn',
            'fadeOut',
            'filter',
            'duration',
            'scaleX',
            'scaleY',
            'scale',
            'alpha',
            'hide',
            'display',
            'select',
            'transition',
            'src',
            'x',
            'y',
            'position',
            'animate',
            'playNext'
        ],

        hide: function (value) {
            if (value) {
                figure.hideFigure();
            }
        },

        filter: function (value) {
            figure.filter(value);
        },

        scaleX: function (value) {
            figure.scaleX(value);
        },

        scaleY: function (value) {
            figure.scaleY(value);
        },

        scale: function (value) {
            figure.scale(value);
        },

        fadeIn: function (value) {
            figure.fadeIn = value;
        },

        fadeOut: function (value) {
            figure.fadeOut = value;
        },

        alpha: function (value) {
            figure.alpha(value);
        },

        duration: function (value) {
            figure.duration = value;
        },

        select: function (value) {
            figure.select(value);
        },

        animate: function (value) {
            figure.animate(value);
        },

        transition: function (value) {
            figure.transition = value;
        },

        display: function (value) {
            if (value) {
                figure.show();
            } else {
                figure.hide();
            }
        },

        src: function (value) {
            figure.load(value);
        },

        x: function (value) {
            figure.position(value);
        },

        y: function (value) {
            figure.position(null, value);
        },

        position: function (value) {
            figure.position(value);
        }
    });

});