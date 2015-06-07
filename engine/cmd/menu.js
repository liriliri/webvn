WebVN.use(function (script, ui)
{
    var menu = ui.get('menu');

    /**
     * Menu Command
     * @class Menu
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.Menu.prototype */
        {
            constructor: function Menu() { this.callSuper('menu') },

            /**
             * @type {Object}
             */
            options: {
                bgm          : { type: 'string',  short: 'bgm' },
                btn          : { type: 'json',    short: 'btn' },
                btnHoverSound: { type: 'string',  short: 'bhs' },
                btnClickSound: { type: 'string',  short: 'bcs' },
                display      : { type: 'boolean', short: 'd' },
                duration     : { type: 'number',  short: 'du' },
                fadeIn       : { type: 'boolean', short: 'fi' },
                fadeOut      : { type: 'boolean', short: 'fo' }
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

            bgm          : function (val) { menu.bgm           = val },
            btnClickSound: function (val) { menu.btnClickSound = val },
            btnHoverSound: function (val) { menu.btnHoverSound = val },
            duration     : function (val) { menu.duration      = val },
            fadeIn       : function (val) { menu.fadeIn        = val },
            fadeOut      : function (val) { menu.fadeOut       = val },
            btn          : function (val) { menu.buttons(val) },
            display      : function (val) { val ? menu.show() : menu.hide() }
        }
    );
});