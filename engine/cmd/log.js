webvn.use(['script', 'log'], function (script, log) {

    var type = 'info';

    script.createCommand({

        constructor: function FigureCommand() {
            this.callSuper('log');
        },

        options: {
            type: {
                type: 'String',
                shortHand: 't'
            },
            message: {
                type: 'String',
                shortHand: 'm'
            },
            playNext: {
                type: 'Boolean',
                shortHand: 'pn',
                defaultValue: true
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