webvn.use(function (script, log, system) {

    var alias = script.alias;

    script.command.create({

        constructor: function AliasCommand() {
            this.callSuper('alias');
        },

        options: {
            name: {
                type: 'String',
                short: 'n'
            },
            value: {
                type: 'String',
                short: 'v'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn',
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

    var define = script.define;

    script.command.create({

        constructor: function () {
            this.callSuper('define')
        },

        options: {
            name: {
                type: 'string',
                short: 'n'
            },
            value: {
                type: 'String',
                short: 'v'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn',
                default: true
            }
        },

        orders: [
            'name',
            'playNext'
        ],

        name: function (value, values) {
            if (values.value) {
                define.create(value, values.value);
            } else {
                log.warn('Define value must be set');
            }
        }

    });

    script.command.create({

        constructor: function ScriptCommand() {
            this.callSuper('script');
        },

        options: {
            jump: {
                type: 'String',
                short: 'j'
            }
        },

        orders: [
            'jump'
        ],

        jump: function (value) {
            script.jump(value);
        }

    });

    script.command.create({

        constructor: function SystemCommand() {
            this.callSuper('system');
        },

        options: {
            title: {
                type: 'String',
                short: 't'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn',
                default: true
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