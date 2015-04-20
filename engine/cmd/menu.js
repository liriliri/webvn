// Command menu

webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var menu = ui.get('menu');

        var Command = script.Command.extend({
            constructor: function () {

                var options = {
                    'bgm': {
                        type: 'String',
                        shortHand: 'bgm'
                    },
                    'btn': {
                        type: 'Json',
                        shortHand: 'btn'
                    },
                    'btnHoverSound': {
                        type: 'String',
                        shortHand: 'bhs'
                    },
                    'btnClickSound': {
                        type: 'String',
                        shortHand: 'bcs'
                    },
                    'display': {
                        type: 'Boolean',
                        shortHand: 'd'
                    },
                    'duration': {
                        type: 'Number',
                        shortHand: 'du'
                    },
                    'fadeIn': {
                        type: 'Boolean',
                        shortHand: 'fi'
                    },
                    'fadeOut': {
                        type: 'Boolean',
                        shortHand: 'fo'
                    }
                };

                this.callSuper('menu', options);

            },
            execution: function (values) {

                if (values.bgm) {
                    menu.bgm = values.bgm;
                }

                if (values.btn) {
                    menu.btn(values.btn);
                }

                if (values.btnClickSound) {
                    menu.btnClickSound = values.btnClickSound;
                }

                if (values.btnHoverSound) {
                    menu.btnHoverSound = values.btnHoverSound;
                }

                if (values.duration) {
                    menu.duration = values.duration;
                }

                if (values.fadeIn === true) {
                    menu.fadeIn = true;
                } else if (values.fadeIn === false) {
                    menu.fadeIn = false;
                }

                if (values.fadeOut === true) {
                    menu.fadeOut = true;
                } else if (values.fadeOut === false) {
                    menu.fadeOut = false;
                }

                if (values.display === true) {
                    menu.show();
                } else if (values.display === false) {
                    menu.hide();
                }

            }
        });

        new Command;

    });