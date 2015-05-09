webvn.use(['script', 'log'], function (script, log) {

    var alias = script.alias;

    script.createCommand({

        constructor: function AliasCommand() {
            this.callSuper('alias');
        },

        options: {
            name: {
                type: 'String',
                shortHand: 'n'
            },
            value: {
                type: 'String',
                shortHand: 'v'
            },
            playNext: {
                type: 'Boolean',
                shortHand: 'pn',
                default: true
            }
        },

        orders: [
            'name',
            'playNext'
        ],

        name: function (value, values) {
            if (values.value) {
                alias.create(value, values.value);
            } else {
                log.warn('Alias value must be set');
            }
        }

    });

});