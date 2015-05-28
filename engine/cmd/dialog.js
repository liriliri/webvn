webvn.use(function (script, ui) {
    var dialog = ui.get('dialog');

    script.createCommand({

        constructor: function DialogCommand() {
            this.callSuper('dialog');
        },

        options: {
            display: {
                type: 'Boolean',
                short: 'd'
            },
            style: {
                type: 'String',
                short: 's'
            },
            face: {
                type: 'String',
                short: 'f'
            },
            duration: {
                type: 'Number',
                short: 'du'
            },
            fadeIn: {
                type: 'Boolean',
                short: 'fi'
            },
            fadeOut: {
                type: 'Boolean',
                short: 'fo'
            },
            name: {
                type: 'String',
                short: 'n'
            },
            text: {
                type: 'String',
                short: 't'
            },
            textDuration: {
                type: 'Number',
                short: 'td'
            },
            textType: {
                type: 'String',
                short: 'tt'
            },
            voice: {
                type: 'String',
                short: 'v'
            },
            stopAnimation: {
                type: 'boolean',
                short: 'sa'
            },
            playNext: {
                type: 'Boolean',
                short: 'pn'
            }
        },

        orders: [
            'fadeIn',
            'fadeOut',
            'style',
            'duration',
            'textType',
            'textDuration',
            'face',
            'display',
            'name',
            'text',
            'voice',
            'stopAnimation',
            'playNext'
        ],

        stopAnimation: function (value) {
            value && dialog.stopAnim();
        },

        face: function (value) {
            dialog.face(value);
        },

        style: function (value) {
            dialog.style(value);
        },

        fadeIn: function (value) {
            dialog.fadeIn = value;
        },

        fadeOut: function (value) {
            dialog.fadeOut = value;
        },

        duration: function (value) {
            dialog.duration = value;
        },

        textType: function (value) {
            dialog.textType = value;
        },

        textDuration: function (value) {
            dialog.textDuration = value;
        },

        display: function (value) {
            value ? dialog.show() : dialog.hide();
        },

        name: function (value) {
            dialog.name(value);
        },

        text: function (value) {
            dialog.text(value);
        },

        voice: function (value) {
            dialog.voice(value);
        }

    });
});