// Video ui component

webvn.use(['ui', 'media', 'script'], function (s, ui, media, script) {

var vid = ui.create('video', 'div'),
    clickAction = 'stop',
    $el = vid.$el;

var tpl = '<video class="video fill"></video>';

vid.body(tpl);

var video = media.createVideo($el.find('.video').get(0));

/* Set action when video is clicked
 * Type listed as below:
 * stop: stop playing video and fade out the video
 * pause: pause the video and play again when clicked again
 */
vid.clickAction = function (action) {

    clickAction = action;

};

vid.play = function () {

    video.play();

};

vid.show = function () {

    $el.show();
    script.pause();

};

vid.src = function (src) {

    video.load(src);

};

vid.stop = function () {

    video.stop();

};

video.event({
    'ended': function () {
        // When the video is ended, execute the next command
        $el.fadeOut(300, function () {

            script.resume();

        });
    }
});

vid.event({
    'click .video': function () {

        switch (clickAction) {
            case 'stop': {
                $el.fadeOut(300, function () {

                    video.stop();
                    script.resume();

                });
                break;
            }
            case 'pause': {
                if (video.isPlaying()) {
                    video.pause();
                } else {
                    video.play();
                }
                break;
            }
            default:
                break;
        }

    }
});

});