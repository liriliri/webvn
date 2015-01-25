/* Audio
 * Create audio and controlls
 */

webvn.add('audio', ['class'], function (s, kclass) {

var audio = {},
    cache = {}; // Audio container

// Create audio element
audio.create = function (name) {

    cache[name] = new Sound();

    return cache[name];

};

// Get audio by name
audio.get = function (name) {

    return cache[name];

};

// Sound class
var Sound = kclass.create({
    constructor: function Sound(src) {

        var self = this,
            audio = new Audio();

        audio.onloadeddata = function () {

            audio.play();    
            self.loaded = true;

        };

        this.audio = audio;
        this.loaded = false;

    },
    // Load 
    load: function (src, cb) {

        s.log.info('Loading audio: ' + src);

        this.audio.src = src;

    },
    // Pause
    pause: function () {

        this.audio.pause();

    },
    // Play
    play: function () {

        this.audio.play();

    },
    // Set current time
    setCurrentTime: function (time) {

        if (this.loaded === true) {
            this.audio.currentTime = time;
        }

    },
    // Set loop
    setLoop: function (flag) {

        this.audio.loop = flag;

    },
    // Set volumn
    setVolumn: function () {

        this.audio.volumn = volume;

    },
    // Stop
    stop: function () {

        this.setCurrentTime(0);
        this.audio.pause();

    }
});

return audio;

});