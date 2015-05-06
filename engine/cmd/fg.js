webvn.use(['script', 'ui'], function (script, ui) {
    var figure = ui.get('figure');

    var Command = script.Command.extend({

        constructor: function FigureCommand() {
            this.callSuper('fg');
        },

        options: {
            filter: {
                type: 'Json',
                shortHand: 'f'
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
            fadeIn: {
                type: 'Boolean',
                shortHand: 'fi'
            },
            fadeOut: {
                type: 'Boolean',
                shortHand: 'fo'
            },
            display: {
                type: 'Boolean',
                shortHand: 'd'
            },
            alpha: {
                type: 'Number',
                shortHand: 'al'
            },
            duration: {
                type: 'Number',
                shortHand: 'du'
            },
            select: {
                type: 'Number',
                shortHand: 'sel'
            },
            transition: {
                type: 'String',
                shortHand: 't'
            },
            src: {
                type: 'String',
                shortHand: 's'
            },
            x: {
                type: 'Number',
                shortHand: 'x'
            },
            y: {
                type: 'Number',
                shortHand: 'y'
            },
            position: {
                type: 'String',
                shortHand: 'pos'
            },
            animate: {
                type: 'Json',
                shortHand: 'a'
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
            'display',
            'select',
            'transition',
            'src',
            'x',
            'y',
            'position',
            'animate'
        ],

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

    new Command;

});