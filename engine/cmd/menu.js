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
             * @property {Boolean} display(d) Show or hide menu.
             * @property {String} bgm(bgm) Background music src.
             * @property {String} background(bg) Background image.
             * @property {Json} button(btn) Set button property.
             * @property {Boolean} fadeIn(fi) Fade in or not.
             * @property {Boolean} fadeOut(fo) Fade out or not.
             * @property {Number} duration(du) Fade in, fade out duration.
             */
            options: {
                display   : { type: 'boolean', short: 'd' },
                bgm       : { type: 'string' , short: 'bgm' },
                background: { type: 'string' , short: 'bg' },
                button    : { type: 'json'   , short: 'btn' },
                hoverSound: { type: 'string' , short: 'hs' },
                clickSound: { type: 'string' , short: 'cs' },
                duration  : { type: 'number' , short: 'du' },
                fadeIn    : { type: 'boolean', short: 'fi' },
                fadeOut   : { type: 'boolean', short: 'fo' }
            },

            orders: [
                'bgm',
                'button',
                'background',
                'clickSound',
                'hoverSound',
                'duration',
                'fadeIn',
                'fadeOut',
                'display'
            ],

            bgm       : function (val) { menu.bgm        = val },
            clickSound: function (val) { menu.clickSound = val },
            hoverSound: function (val) { menu.hoverSound = val },
            background: function (val) { menu.background = val },
            duration  : function (val) { menu.duration   = val },
            fadeIn    : function (val) { menu.fadeIn     = val },
            fadeOut   : function (val) { menu.fadeOut    = val },
            button    : function (val) { menu.buttons(val) },
            display   : function (val) { val ? menu.show() : menu.hide() }
        }
    );
});