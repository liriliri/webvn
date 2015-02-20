// Video module

webvn.add('video', ['class', 'util'], function (s, kclass, util) {

var video = {};

video.create = function (v) {

    return new Video(v);

};

var Video = kclass.create({
    constructor: function Video(v) {

        this.video = v;

    },
    event: function (events) {

        var self = this;
        util.each(events, function (fn, type) {

            self.video['on' + type] = fn;

        });

    },
    isPlaying: function () {

        return !this.video.paused;

    },
    // Pause
    pause: function () {

        this.video.pause();

    },
    play: function () {

        this.video.play();

    },
    // Set current time
    setCurrentTime: function (time) {

        if (this.loaded === true) {
            this.video.currentTime = time;
        }

    },
    // Stop
    stop: function () {

        this.setCurrentTime(0);
        this.video.pause();

    }
});

return video;

});