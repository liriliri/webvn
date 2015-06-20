WebVN.use(function (script, log)
{
    var type = 'info';

    /**
     * Log command.
     * @class Log
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.Log.prototype */
        {
            constructor: function Log() { this.callSuper('log'); },

            /**
             * @type {Object}
             */
            options: {
                type    : { type: 'String' , short: 't' },
                message : { type: 'String' , short: 'm' },
                clear   : { type: 'Boolean', short: 'c' },
                playNext: { type: 'Boolean', short: 'pn', default: true }
            },

            orders: [
                'clear',
                'type',
                'message',
                'playNext'
            ],

            clear  : function (val) { val && log.clear() },
            type   : function (val) { type = val },
            message: function (val)
            {
                switch (type)
                {
                    case 'info' : log.info(val);  break;
                    case 'warn' : log.warn(val);  break;
                    case 'error': log.error(val); break;
                }
            }
        }
    );

});