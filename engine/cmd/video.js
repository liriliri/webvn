// Command video

webvn.use(['script', 'ui'],
    function (s, script, ui) {

        var video = ui.get('video');

        var Command = script.Command.extend({
            constructor: function () {

                var options = {
                    display: {
                        type: 'Boolean',
                        shortHand: 'd'
                    },
                    click: {
                        type: 'String',
                        shortHand: 'c'
                    },
                    play: {
                        type: 'Boolean',
                        shortHand: 'pl'
                    },
                    src: {
                        type: 'String',
                        shortHand: 's'
                    }
                };

                this.callSuper('video', options);

            },
            execution: function (values) {

                if (values.display === true) {
                    video.show();
                } else if (values.display === false) {
                    video.hide();
                }

                if (values.src) {
                    video.src(values.src);
                }

                if (values.play === true) {
                    video.play();
                } else if (values.play === false) {
                    video.stop();
                }

                if (!values.click) {
                    values.click = 'stop';
                }
                video.clickAction(values.click);

            }
        });

        new Command;

    });