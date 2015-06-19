WebVN.use(function (script, log, system)
{
    var command = script.command,
        define  = script.define,
        alias   = script.alias;

    /**
     * @class Alias
     * @memberof script.command
     */
    command.create(
        {
            constructor: function Alias() { this.callSuper('alias') },

            options: {
                name    : { type: 'string',  short: 'n' },
                value   : { type: 'string',  short: 'v' },
                playNext: { type: 'boolean', short: 'pn', default: true }
            },

            orders: ['name', 'playNext'],

            name: function (val, values)
            {
                values.value && alias.create(val, values.value);
            }
        }
    );

    /**
     * @class Define
     * @memberof script.Define
     */
    command.create(
        {
            constructor: function Define() { this.callSuper('define') },

            options: {
                name    : { type: 'string',  short: 'n' },
                value   : { type: 'String',  short: 'v' },
                playNext: { type: 'Boolean', short: 'pn', default: true }
            },

            orders: ['name', 'playNext'],

            name: function (val, values)
            {
                values.value && define.create(val, values.value);
            }
        }
    );

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