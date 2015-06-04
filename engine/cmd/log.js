webvn.use(function (script, log)
{
    var type = 'info';

    /**
     * Log command.
     * @class CmdLog
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.CmdLog.prototype */
        {
            constructor: function CmdLog() { this.callSuper('log'); },

            /**
             * @type {Object}
             */
            options: {
                type    : { type: 'String',  short: 't' },
                message : { type: 'String',  short: 'm' },
                playNext: { type: 'Boolean', short: 'pn', default: true }
            },

            orders: [
                'type',
                'message',
                'playNext'
            ],

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