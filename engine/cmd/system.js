WebVN.use(function (script, system)
{
    /**
     * @class System
     * @memberof script.command
     */
    script.command.create(
        /** @lends script.command.System.prototype */
        {
            constructor: function System() {this.callSuper('system') },

            options: {
                title   : { type: 'string',  short: 't' },
                playNext: { type: 'boolean', short: 'pn', default: true }
            },

            orders: ['title', 'playNext'],

            title: function (val) { system.title(val) }
        }
    );
});