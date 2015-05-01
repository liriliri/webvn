/**
 * Audio and video
 * @namespace webvn.media
 */
webvn.module('media', ['class', 'log', 'util', 'anim'], function (kclass, log, util, anim) {
    var exports = {};

    // Const variables
    var STATE = {
            NOT_LOADED: 0,
            PAUSE: 1,
            PLAY: 2
        };

    /**
     * @class webvn.media.Base
     */
    var Base = exports.Base = kclass.create({
        constructor: function Base() {
            this.state = STATE.NOT_LOADED;
            this.el = null;
        },
        /**
         * Load media and play(optional)
         * @method webvn.media.Base#load
         * @param {string} src source of media
         * @param {boolean=} [autoPlay=true] play media after loading
         */
        load: function (src, autoPlay) {
            if (autoPlay === undefined) {
                autoPlay = true;
            }
            var self = this;
            // Stop playing music
            this.stop();
            this.state = STATE.NOT_LOADED;
            // AutoPlay init
            if (autoPlay) {
                this.el.onloadeddata = function () {
                    self.state = STATE.PAUSE;
                    self.play();
                };
            } else {
                this.el.onloadeddata = function () {
                    self.state = STATE.PAUSE;
                }
            }
            // Start loading
            this.el.src = src;
        },
        /**
         * Pause media
         * @method webvn.media.Base#pause
         */
        pause: function () {
            if (this.state === STATE.PLAY) {
                this.el.pause();
                this.state = STATE.PAUSE;
            }
        },
        /**
         * Play media
         * @method webvn.media.Base#play
         */
        play: function () {
            if (this.state === STATE.PAUSE) {
                this.el.play();
                this.state = STATE.PLAY;
            }
        },
        isPlaying: function () {
            "use strict";
            return this.state === STATE.PLAY;
        },
        /**
         * Stop media
         * @method webvn.media.Base#stop
         */
        stop: function () {
            if (this.state !== STATE.NOT_LOADED) {
                this.currentTime(0);
                this.pause();
                this.state = STATE.PAUSE;
            }
        },
        /**
         * Set the currentTime of media
         * @method webvn.media.Base#currentTime
         * @param {number} time seconds
         */
        /**
         * Get the currentTime of media
         * @method webvn.media.Base#currentTime
         * @returns {number}
         */
        currentTime: function (time) {
            if (this.state !== STATE.NOT_LOADED) {
                if (time !== undefined) {
                    this.el.currentTime = time;
                } else {
                    return this.el.currentTime;
                }
            }
        },
        /**
         * Set the volume of media
         * @method webvn.media.Base#volume
         * @param {number} time float number between 0 and 1
         */
        /**
         * Get the volume of media
         * @method webvn.media.Base#volume
         * @returns {Number}
         */
        volume: function (volume) {
            if (volume !== undefined) {
                this.el.volume = volume;
            } else {
                return this.el.volume;
            }
        },
        /**
         * Loop media or not
         * @method webvn.media.Base#loop
         * @param {boolean} flag loop or not
         */
        loop: function (flag) {
            this.el.loop = flag;
        },
        /**
         * Set events of media
         * @method webvn.media.Base#event
         * @param {object} events events such as onload, onended
         */
        event: function (events) {
            var self = this;
            util.each(events, function (fn, type) {
                self.el['on' + type] = fn;
            });
        }
    });

    /**
     * Append class in order not to conflict with primitive Audio class.
     * @class webvn.media.AudioClass
     * @extends webvn.media.Base
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
                    self.duration = self.el.duration;
                    self.state = STATE.PAUSE;
                    self.play();
                };
            } else {
                this.el.onloadeddata = function () {
                    self.duration = self.el.duration;
                    self.state = STATE.PAUSE;
                }
            }
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
                this._anim = anim.create(this.el).to({
                    volume: this._volume
                }, this.duration).call(function () {
                    self._anim = null;
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
                this.state = STATE.FADE_OUT;
                this._volume = this.volume();
                this._anim = anim.create(this.el).to({
                    volume: 0
                }, this.duration).call(function () {
                    self._anim = null;
                    self.volume(self._volume);
                    self.el.pause();
                    self.state = STATE.PAUSE;
                });
            } else {
                this.el.pause();
                this.state = STATE.PAUSE;
            }
        },
        _stopTween: function () {
            if (this._anim) {
                this._anim.stop();
                this.volume(this._volume);
            }
        }
    });

    /**
     * Unlike audio, video object is passed by user.
     * @class webvn.media.Video
     * @extends webvn.media.Base
     * @param {object} video video element
     */
    var Video = exports.Video = Base.extend({
        constructor: function Video(video) {
            this.callSuper();
            this.el = video;
        }
    });

    var audioCache = {};

    /**
     * Create an AudioClass instance
     * @function webvn.media.createAudio
     * @param {string} name name of audio
     * @returns {AudioClass}
     */
    var createAudio = exports.createAudio = function (name) {
        if (audioCache[name]) {
            return audioCache[name];
        }
        audioCache[name] = new AudioClass();
        return audioCache[name];
    };

    /**
     * Get audio instance if exists
     * @function webvn.media.getAudio
     * @param {string} name name of audio
     * @returns {AudioClass|undefined}
     */
    exports.getAudio = function (name) {
        return audioCache[name];
    };

    /**
     * Create a Video instance
     * @function webvn.media.createVideo
     * @param {object} video video element
     * @returns {Video}
     */
    exports.createVideo = function (video) {
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