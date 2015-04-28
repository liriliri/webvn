webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var particle = ui.get('particle');

        var Command = script.Command.extend({
            constructor: function ParticleCommand() {
                this.callSuper('particle');
            },
            options: {
                display: {
                    type: 'Boolean',
                    shortHand: 'd'
                },
                type: {
                    type: 'String',
                    shortHand: 't'
                }
            },
            orders: [
                'display',
                'type'
            ],
            display: function (value) {
                "use strict";
                if (value) {
                    particle.show();
                } else {
                    particle.hide();
                }
            },
            type: function (value) {
                "use strict";
                particle.type(value);
            }
        });
        new Command;
    });