WebVN.use(function (script, log, system)
{
    var command = script.command,
        define  = script.define,
        alias   = script.alias;

    command.create(
        {
            constructor: function CmdAlias() { this.callSuper('alias') },

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


    command.create(
        {
            constructor: function () { this.callSuper('define') },

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
    });

    command.create(
        {
            constructor: function CmdScript() { this.callSuper('script') },

            options: {
                jump: { type: 'String', short: 'j' }
            },

            orders: ['jump'],

            jump: function (val) { script.jump(val) }
        }
    );

    command.create(
        {
            constructor: function CmdSystem () {this.callSuper('system') },

            options: {
                title   : { type: 'String',  short: 't' },
                playNext: { type: 'Boolean', short: 'pn', default: true }
            },

            orders: ['title', 'playNext'],

            title: function (val) { system.title(val) }
        }
    );

});