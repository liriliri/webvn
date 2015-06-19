/**
 * @module command
 */
WebVN.use(function (script, ui)
{
    var figure = ui.get('figure');

    /**
     * Figure command
     * @class Fg
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.Fg.prototype */
        {
            constructor: function Fg() { this.callSuper('fg'); },

            options: {
                filter    : { type: 'json',    short: 'f' },
                hide      : { type: 'Boolean', short: 'h' },
                scaleX    : { type: 'Number',  short: 'sx' },
                scaleY    : { type: 'Number',  short: 'sy' },
                scale     : { type: 'Number',  short: 'sc' },
                fadeIn    : { type: 'Boolean', short: 'fi' },
                fadeOut   : { type: 'Boolean', short: 'fo' },
                display   : { type: 'Boolean', short: 'd' },
                alpha     : { type: 'Number',  short: 'al' },
                duration  : { type: 'Number',  short: 'du' },
                select    : { type: 'Number',  short: 'sel' },
                transition: { type: 'String',  short: 't' },
                src       : { type: 'String',  short: 's' },
                x         : { type: 'Number',  short: 'x' },
                y         : { type: 'Number',  short: 'y' },
                position  : { type: 'String',  short: 'pos' },
                animate   : { type: 'Json',    short: 'a' },
                playNext  : { type: 'Boolean', short: 'pn', default: true }
            },

            orders: [
                'fadeIn',
                'fadeOut',
                'filter',
                'duration',
                'scaleX',
                'scaleY',
                'scale',
                'alpha',
                'hide',
                'display',
                'select',
                'transition',
                'src',
                'x',
                'y',
                'position',
                'animate',
                'playNext'
            ],

            hide      : function (val) { val && figure.hideFigure() },
            filter    : function (val) { figure.filter = val },
            scaleX    : function (val) { figure.scaleX = val },
            scaleY    : function (val) { figure.scaleY = val },
            scale     : function (val) { figure.scale = val },
            alpha     : function (val) { figure.alpha = val },
            fadeIn    : function (val) { figure.fadeIn     = val },
            fadeOut   : function (val) { figure.fadeOut    = val },
            duration  : function (val) { figure.duration   = val },
            transition: function (val) { figure.transition = val },
            select    : function (val) { figure.select = val },
            animate   : function (val) { figure.animate(val) },
            display   : function (val) { val ? figure.show() : figure.hide() },
            src       : function (val) { figure.load(val) },
            x         : function (val) { figure.position(val) },
            y         : function (val) { figure.position(null, val) },
            position  : function (val) { figure.position(val) }
        }
    );

});