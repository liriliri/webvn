// Command menu

webvn.use(['script', 'ui', 'media'],
    function (s, script, ui, media) {

        var menu = ui.get('menu');

        script.createCommand('menu', {
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
        }, function (options, value) {

            if (options.bgm) {
                menu.bgm = options.bgm;
            }

            if (options.btn) {
                menu.btn(options.btn);
            }

            if (options.btnClickSound) {
                menu.btnClickSound = options.btnClickSound;
            }

            if (options.btnHoverSound) {
                menu.btnHoverSound = options.btnHoverSound;
            }

            if (options.duration) {
                menu.duration = options.duration;
            }

            if (options.fadeIn === true) {
                menu.fadeIn = true;
            } else if (options.fadeIn === false) {
                menu.fadeIn = false;
            }

            if (options.fadeOut === true) {
                menu.fadeOut = true;
            } else if (options.fadeOut === false) {
                menu.fadeOut = false;
            }

            if (options.display === true) {
                menu.show();
            } else if (options.display === false) {
                menu.hide();
            }

        });

    });