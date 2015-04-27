webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var particle = ui.get('particle');

        var Command = script.Command.extend({
            constructor: function () {
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
            execution: function (values) {

                if (values.display === true) {
                    particle.show();
                } else if (values.display === false) {
                    particle.hide();
                }

                if (values.type) {
                    particle.type(values.type);
                }

            }
        });

        new Command;

    });