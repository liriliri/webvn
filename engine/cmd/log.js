webvn.use(function (script, log) {
    var type = 'info';

    script.command.create({

        constructor: function FigureCommand() {
            this.callSuper('log');
        },

        options: {
            type: {
                type: 'String',
                short: 't'
            },
            message: {
                type: 'String',
                short: 'm'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn',
                default: true
            }
        },

        orders: [
            'type',
            'message',
            'playNext'
        ],

        type: function (value) {
            type = value;
        },

        message: function (value) {
            switch (type) {
                case 'info':
                    log.info(value);
                    break;
                case 'warn':
                    log.warn(value);
                    break;
                case 'error':
                    log.error(value);
                    break;
            }
        }

    });

});