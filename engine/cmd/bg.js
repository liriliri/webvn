WebVN.use(function (script, ui)
{
    var background = ui.get('background');

    /**
     * Background command.
     * @class Bg
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.Bg.prototype */
        {
            constructor: function Bg() { this.callSuper('bg'); },

            options: {
                fadeIn        : { type: 'boolean', short: 'fi' },
                fadeOut       : { type: 'boolean', short: 'fo' },
                filter        : { type: 'json',    short: 'f' },
                position      : { type: 'string',  short: 'pos' },
                x             : { type: 'number',  short: 'x' },
                y             : { type: 'number',  short: 'y' },
                animate       : { type: 'json',    short: 'a' },
                scaleX        : { type: 'number',  short: 'sx'},
                scaleY        : { type: 'number',  short: 'sy'},
                scale         : { type: 'number',  short: 'sc' },
                display       : { type: 'boolean', short: 'd' },
                duration      : { type: 'number',  short: 'du' },
                transition    : { type: 'string',  short: 't' },
                src           : { type: 'string',  short: 's' },
                playNext      : { type: 'boolean', short: 'pn', default: true },
                waitTransition: { type: 'boolean', short: 'wt' }
            },

            orders: [
                'x',
                'y',
                'fadeIn',
                'fadeOut',
                'filter',
                'position',
                'duration',
                'animate',
                'scale',
                'scaleX',
                'scaleY',
                'transition',
                'display',
                'src',
                'waitTransition',
                'playNext'
            ],

            waitTransition: function (val, values)
            {
                if (values.src)
                {
                    if (values.playNext) val && script.wait(background.duration);
                    else val && script.pause(background.duration);
                }
            },
            fadeIn    : function (val) { background.fadeIn  = val },
            fadeOut   : function (val) { background.fadeOut = val },
            filter    : function (val) { background.filter  = val },
            position  : function (val) { background.position(val) },
            x         : function (val) { background.position(val) },
            y         : function (val) { background.position(null, val) },
            animate   : function (val) { background.animate(val) },
            scale     : function (val) { background.scale  = val },
            scaleX    : function (val) { background.scaleX = val },
            scaleY    : function (val) { background.scaleY = val },
            display   : function (val) { val ? background.show() : background.hide() },
            duration  : function (val) { background.duration = val },
            transition: function (val) { background.transition = val },
            src       : function (val) { background.load(val) }
        }
    );
});