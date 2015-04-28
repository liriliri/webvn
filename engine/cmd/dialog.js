webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var dialog = ui.get('dialog');

        var Command = script.Command.extend({
            constructor: function DialogCommand() {
                this.callSuper('dialog');
            },
            options: {
                display: {
                    type: 'Boolean',
                    shortHand: 'd'
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
                }
            },
            orders: [

            ],
            execution: function (values) {
                if (values.fadeIn === true) {
                    dialog.fadeIn = true;
                } else if (values.fadeIn === false) {
                    dialog.fadeIn = false;
                }
                if (values.fadeOut === true) {
                    dialog.fadeOut = true;
                } else if (values.fadeOut === false) {
                    dialog.fadeOut = false;
                }
                if (values.duration) {
                    dialog.duration = values.duration;
                }
                if (values.textType) {
                    dialog.textType = values.textType;
                }
                if (values.textDuration) {
                    dialog.textDuration = values.textDuration;
                }
                if (values.display === true) {
                    dialog.show();
                } else if (values.display === false) {
                    dialog.hide();
                }
                if (values.name) {
                    dialog.name(values.name);
                }
                if (values.text) {
                    dialog.text(values.text);
                }
                if (values.voice) {
                    dialog.voice(values.voice);
                }
            }
        });
        new Command;
    });