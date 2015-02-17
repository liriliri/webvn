// Video ui component

webvn.use(['ui', 'video', 'script'], function (s, ui, video, script) {

var vid = ui.create('video', 'div'),
    $ele = vid.$ele;

var tpl = '<video class="video fill" src="/asset/test/video.mp4"></video>';

vid.body(tpl);

var video = video.create($ele.find('.video').get(0));

vid.play = function () {

    video.play();

};

vid.stop = function () {

    video.stop();

};

vid.event({
    'click .video': function () {

        $ele.fadeOut(function () {

            video.stop();
            script.play();

        });

    }
});

});