webvn.use(['script', 'ui'], function (script, ui) {

        var menu = ui.get('menu');
        /**
         * Menu Command
         * @class webvn.cmd.MenuCommand
         * @extends webvn.script.Command
         */
        var Command = script.Command.extend({
            constructor: function MenuCommand() {
                this.callSuper('menu');
            },
            /**
             * @memberof webvn.cmd.MenuCommand
             * @property {String} bgm{bgm} background music
             */
            options: {
                'bgm': {
                    type: 'String',
                    shortHand: 'bgm'
                },
                'btn': {
                    type: 'Json',
                    shortHand: 'btn'
                },
                'btnHoverSound': {
                    type: 'String',
                    shortHand: 'bhs'
                },
                'btnClickSound': {
                    type: 'String',
                    shortHand: 'bcs'
                },
                'display': {
                    type: 'Boolean',
                    shortHand: 'd'
                },
                'duration': {
                    type: 'Number',
                    shortHand: 'du'
                },
                'fadeIn': {
                    type: 'Boolean',
                    shortHand: 'fi'
                },
                'fadeOut': {
                    type: 'Boolean',
                    shortHand: 'fo'
                }
            },
            orders: [
                'bgm',
                'btn',
                'btnClickSound',
                'btnHoverSound',
                'duration',
                'fadeIn',
                'fadeOut',
                'display'
            ],
            bgm: function (value) {
                "use strict";
                menu.bgm = value;
            },
            btn: function (value) {
                "use strict";
                menu.btn(value);
            },
            btnClickSound: function (value) {
                "use strict";
                menu.btnClickSound = value;
            },
            btnHoverSound: function (value) {
                "use strict";
                menu.btnHoverSound = value;
            },
            duration: function (value) {
                "use strict";
                menu.duration = value;
            },
            fadeIn: function (value) {
                "use strict";
                menu.fadeIn = value;
            },
            fadeOut: function (value) {
                "use strict";
                menu.fadeOut = value;
            },
            display: function (value) {
                "use strict";
                if (value) {
                    menu.show();
                } else {
                    menu.hide();
                }
            }
        });
        new Command;
    });