// Video module

webvn.add('video', ['class'], function (s, kclass) {

var video = {};

video.create = function (v) {

    return new Video(v);

};

var Video = kclass.create({
    constructor: function Video(v) {

        this.video = v;

    },
    play: function () {

        this.video.play();

    },
    // Stop
    stop: function () {

        this.video.pause();

    }
});

return video;

});