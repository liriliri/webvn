webvn.use(function (script, ui) {

    var menu = ui.get('menu');
    /**
     * Menu Command
     * @class webvn.cmd.MenuCommand
     * @extends webvn.script.Command
     */
    script.command.create({
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
                short: 'bgm'
            },
            'btn': {
                type: 'Json',
                short: 'btn'
            },
            'btnHoverSound': {
                type: 'String',
                short: 'bhs'
            },
            'btnClickSound': {
                type: 'String',
                short: 'bcs'
            },
            'display': {
                type: 'Boolean',
                short: 'd'
            },
            'duration': {
                type: 'Number',
                short: 'du'
            },
            'fadeIn': {
                type: 'Boolean',
                short: 'fi'
            },
            'fadeOut': {
                type: 'Boolean',
                short: 'fo'
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
            menu.buttons(value);
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
});