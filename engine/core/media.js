/* Module media
 * Audio and video utility
 */

webvn.add('media', ['class', 'log', 'util'], 
    function (s, kclass, log, util) {

var exports = {};

// Const variables
var STATE = {
        NOTLOADED: 0,
        PAUSE: 1,
        PLAY: 2
    };

// Class Base
var Base = exports.Base = kclass.create({
    constructor: function Base() {

        this.state = STATE.NOTLOADED;
        this.el = null;

    },
    load: function (src, autoplay) {

        if (autoplay === undefined) {
            autoplay = true;
        }

        var self = this;

        // Stop playing music
        if (this.state === STATE.PLAY) {
            this.stop();
        }
        this.state === STATE.NOTLOADED;

        // Autoplay init
        if (autoplay) {
            this.el.onloadeddata = function () {

                self.el.play();
                self.state = STATE.PLAY;

            };
        } else {
            this.el.onloadeddata = function () {

                self.state = STATE.PAUSE;

            }
        }

        log.info('Loading media: ' + src);

        // Start loading
        this.el.src = src;

    },
    pause: function () {

        if (this.state === STATE.PLAY) {
            this.el.pause();
            this.state = STATE.PAUSE;
        }

    },
    play: function () {

        if (this.state === STATE.PAUSE) {
            this.el.play();
            this.state = STATE.PLAY;
        }

    },
    stop: function () {

        if (this.state !== STATE.NOTLOADED) {
            this.currentTime(0);
            this.pause();
            this.state = STATE.PAUSE;
        }

    },
    currentTime: function (time) {

        if (this.state !== STATE.NOTLOADED) {
            this.el.currentTime = time;
        }

    },
    volumn: function (volumn) {

        this.el.volumn = volumn;

    },
    loop: function (flag) {

        this.el.loop = flag;

    },
    event: function (events) {

        var self = this;

        util.each(events, function (fn, type) {

            self.el['on' + type] = fn;

        });

    }
});

/* Class Audio
 * Applend class in order not to confict with primitive Audio class
 */
var AudioClass = exports.AudioClass = Base.extend({
    constructor: function AudioClass() {

        this.callSuper();

        this.el = new Audio;

    }
});

/* Class Video
 * Unlike audio, video object is passed by user
 */
var Video = exports.Video = Base.extend({
    constructor: function Video(video) {

        this.callSuper();

        this.el = video;

    }
});

var audioCache = {};

var createAudio = exports.createAudio = function (name) {

    if (audioCache[name]) {
        return audioCache[name];
    }

    audioCache[name] = new AudioClass();

    return audioCache[name];

};

var createVideo = exports.createVideo = function (video) {

    return new Video(video);

};

// Init audios
// Background music
var bgm = createAudio('bgm');
bgm.loop(true);
// Sound effect
createAudio('se');
// Voice
createAudio('vo');
// System sound, for example: button hover effect
createAudio('sys');

return exports;

});