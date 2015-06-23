WebVN.use(function (script, log, system)
{
    var command = script.command;

    /**
     * @class System
     * @memberof script.command
     */
    command.create(
        {
            constructor: function System() {this.callSuper('system') },

            options: {
                title   : { type: 'String',  short: 't' },
                playNext: { type: 'Boolean', short: 'pn', default: true }
            },

            orders: ['title', 'playNext'],

            title: function (val) { system.title(val) }
        }
    );

});