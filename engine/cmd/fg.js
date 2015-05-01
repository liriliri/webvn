webvn.use(['script', 'ui'],
    function (script, ui) {

        var figure = ui.get('figure');

        var Command = script.Command.extend({
            constructor: function FigureCommand() {
                this.callSuper('fg');
            },
            options: {
                display: {
                    type: 'Boolean',
                    shortHand: 'd'
                },
                select: {
                    type: 'Number',
                    shortHand: 'sel'
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
                }
            },
            orders: [
                'select',
                'display',
                'src',
                'x',
                'y',
                'position'
            ],
            select: function (value) {
                "use strict";
                figure.select(value);
            },
            display: function (value) {
                "use strict";
                if (value) {
                    figure.show();
                } else {
                    figure.hide();
                }
            },
            src: function (value) {
                "use strict";
                figure.src(value);
            },
            x: function (value) {
                "use strict";
                figure.pos(value);
            },
            y: function (value) {
                "use strict";
                figure.pos(null, value);
            },
            position: function (value) {
                "use strict";
                figure.pos(value);
            }
        });

        new Command;

    });