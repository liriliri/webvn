// Command fg

webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var figure = ui.get('figure');

        var Command = script.Command.extend({
            constructor: function () {

                var options = {
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
                };

                this.callSuper('fg', options);

            },
            execution: function (values) {

                if (values.select) {
                    figure.select(values.select);
                }

                if (values.display === true) {
                    figure.show();
                } else if (values.display === false) {
                    figure.hide();
                }

                if (values.src) {
                    figure.src(values.src);
                }

                if (values.x) {
                    figure.pos(values.x);
                }

                if (values.y) {
                    figure.pos(null, values.y);
                }

                if (values.position) {
                    figure.pos(values.position);
                }

            }
        });

        new Command;

    });