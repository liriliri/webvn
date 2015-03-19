/* Module media
 * Audio and video utility
 */

webvn.add('media', ['class', 'log', 'util', 'tween'],
    function (s, kclass, log, util, tween) {

        var exports = {};

        // Const variables
        var STATE = {
                NOT_LOADED: 0,
                PAUSE: 1,
                PLAY: 2,
                FADE_OUT: 3
            };

        // Class Base
        var Base = exports.Base = kclass.create({
            constructor: function Base() {

                this.state = STATE.NOT_LOADED;
                this.el = null;

            },
            load: function (src, autoplay) {

                if (autoplay === undefined) {
                    autoplay = true;
                }

                var self = this;

                // Stop playing music
                this.stop();
                this.state = STATE.NOT_LOADED;

                // Autoplay init
                if (autoplay) {
                    this.el.onloadeddata = function () {

                        self.state = STATE.PAUSE;
                        self.play();

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

                if (this.state !== STATE.NOT_LOADED) {
                    this.currentTime(0);
                    this.pause();
                    this.state = STATE.PAUSE;
                }

            },
            currentTime: function (time) {

                if (this.state !== STATE.NOT_LOADED) {
                    this.el.currentTime = time;
                }

            },
            volume: function (volume) {

                if (volume !== undefined) {
                    this.el.volume = volume;
                } else {
                    return this.el.volume;
                }

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
                this.duration = 0;
                this.fadeIn = false;
                this.fadeOut = false;

            },
            load: function (src, autoplay) {

                if (autoplay === undefined) {
                    autoplay = true;
                }

                var self = this;

                // Stop playing music
                this.stop();
                this.state = STATE.NOT_LOADED;

                // Autoplay init
                if (autoplay) {
                    this.el.onloadeddata = function () {

                        self.state = STATE.PAUSE;
                        self.play();

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
            play: function () {

                this.callSuper();

                if (this.fadeIn) {
                    this._stopTween();
                    var self = this;
                    this._volume = this.volume();
                    this.volume(0);
                    this._tween = tween.create(this.el).to({
                        volume: this._volume
                    }, this.duration).call(function () {

                        self._tween = null;

                    });
                }

            },
            pause: function () {

                var self = this;

                if (this.state !== STATE.PLAY) {
                    return;
                }

                if (this.fadeOut) {
                    this._stopTween();
                    var self = this;
                    this.state = STATE.FADE_OUT;
                    this._volume = this.volume();
                    this._tween = tween.create(this.el).to({
                        volume: 0
                    }, this.duration).call(function () {

                        this._tween = null;
                        self.volume(self._volume);
                        self.el.pause();
                        this.state = STATE.PAUSE;

                    });
                } else {
                    this.el.pause();
                    this.state = STATE.PAUSE;
                }

            },
            _stopTween: function () {

                if (this._tween) {
                    this._tween.stop();
                    this.volume(this._volume);
                }

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
        bgm.duration = 2000;
        // Sound effect
        createAudio('se');
        // Voice
        createAudio('vo');
        // System sound, for example: button hover effect
        createAudio('sys');

        return exports;

    });