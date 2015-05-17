webvn.use(function (script, ui) {
    var dialog = ui.get('dialog');

    script.createCommand({

        constructor: function DialogCommand() {
            this.callSuper('dialog');
        },

        options: {
            display: {
                type: 'Boolean',
                shortHand: 'd'
            },
            style: {
                type: 'String',
                shortHand: 's'
            },
            face: {
                type: 'String',
                shortHand: 'f'
            },
            duration: {
                type: 'Number',
                shortHand: 'du'
            },
            fadeIn: {
                type: 'Boolean',
                shortHand: 'fi'
            },
            fadeOut: {
                type: 'Boolean',
                shortHand: 'fo'
            },
            name: {
                type: 'String',
                shortHand: 'n'
            },
            text: {
                type: 'String',
                shortHand: 't'
            },
            textDuration: {
                type: 'Number',
                shortHand: 'td'
            },
            textType: {
                type: 'String',
                shortHand: 'tt'
            },
            voice: {
                type: 'String',
                shortHand: 'v'
            },
            playNext: {
                type: 'Boolean',
                shortHand: 'pn'
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
            'playNext'
        ],

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
            if (value) {
                dialog.show();
            } else {
                dialog.hide();
            }
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