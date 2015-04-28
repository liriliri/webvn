webvn.use(['script', 'ui'],
    function (s, script, ui) {
        var background = ui.get('background');
        /**
         * Background Command
         * @class webvn.cmd.BgCommand
         * @extends webvn.script.Command
         */
        var Command = script.Command.extend({
            constructor: function () {
                this.callSuper('bg');
            },
            options: {
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
            },
            orders: [
                'display',
                'src'
            ],
            display: function (value) {
                "use strict";
                if (value) {
                    background.show();
                } else {
                    background.hide();
                }
            },
            src: function (value) {
                "use strict";
                background.src(value);
            }
        });
        new Command;
    });