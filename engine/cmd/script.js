WebVN.use(function (script)
{
    /**
     * @class Script
     * @memberof script.command
     */
    script.command.create(
        {
            constructor: function Script() { this.callSuper('script') },

            options: {
                jump: { type: 'String', short: 'j' },
                wait: { type: 'Number', short: 'w' }
            },

            orders: [
                'jump',
                'wait'
            ],

            jump: function (val) { script.jump(val) },

            wait: function (val) { script.wait(val) }
        }
    );
});