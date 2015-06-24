WebVN.use(function (script)
{
    /**
     * @class Script
     * @memberof script.command
     */
    script.command.create(
        /** @lends script.command.Script.prototype */
        {
            constructor: function Script() { this.callSuper('script') },

            options: {
                jump    : { type: 'string', short: 'j' },
                wait    : { type: 'number', short: 'w' },
                define  : { type: 'string|string', short: 'd' },
                alias   : { type: 'string|string', short: 'a' },
                playNext: { type: 'boolean', short: 'pn' }
            },

            orders: [
                'jump',
                'wait',
                'define',
                'alias',
                'playNext'
            ],

            jump  : function (val) { script.jump(val) },
            wait  : function (val) { script.wait(val) },
            define: function (val) { script.define.create(val[0], val[1]) },
            alias : function (val) { script.alias.create(val[0], val[1]) }
        }
    );
});