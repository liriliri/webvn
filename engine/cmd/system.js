webvn.use(function (script, log, system) {

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
                defaultValue: true
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

    script.createCommand({

        constructor: function ScriptCommand() {
            this.callSuper('script');
        },

        options: {
            jump: {
                type: 'String',
                shortHand: 'j'
            }
        },

        orders: [
            'jump'
        ],

        jump: function (value) {
            script.jump(value);
        }

    });

    script.createCommand({

        constructor: function SystemCommand() {
            this.callSuper('system');
        },

        options: {
            title: {
                type: 'String',
                shortHand: 't'
            },
            playNext: {
                type: 'Boolean',
                shortHand: 'pn',
                defaultValue: true
            }
        },

        orders: [
            'title',
            'playNext'
        ],

        title: function (value) {
            system.title(value);
        }

    });

});