// Command bg

webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var background = ui.get('background');

        var Command = script.Command.extend({
            constructor: function () {

                var options = {
                    display: {
                        type: 'Boolean',
                        shortHand: 'd',
                        desc: 'Whether the background is displayed'
                    },
                    src: {
                        type: 'String',
                        shortHand: 's',
                        desc: 'Source of the current background image'
                    }
                };

                this.callSuper('bg', options);

            },
            execution: function (values) {

                if (values.display === true) {
                    background.show();
                } else if (values.display === false) {
                    background.hide();
                }

                if (values.src) {
                    background.src(values.src);
                }

            }
        });

        new Command;

    });