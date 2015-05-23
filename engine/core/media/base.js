webvn.module('media', function (Class, log, util, anim, config, storage, exports) {
    // Const variables
    var STATE = exports.STATE = {
        NOT_LOADED: 0,
        PAUSE: 1,
        PLAY: 2
    };

    var Base = exports.Base = Class.create({
        constructor: function Base() {
            this.state = STATE.NOT_LOADED;
            this.el = null;
        },

        isLoaded: function () {
            return this.state !== STATE.NOT_LOADED;
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
                this.curTime = 0;
                this.pause();
                this.state = STATE.PAUSE;
            }
        },

        /**
         * Set events of media
         * @method webvn.media.Base#event
         * @param {object} events events such as onload, onended
         */
        events: function (events) {
            var self = this;
            util.each(events, function (fn, type) {
                self.el['on' + type] = fn;
            });
        }

    }, {
        loop: {
            get: function () {
                return this.el.loop;
            },
            set: function (val) {
                this.el.loop = val;
            }
        },
        curTime: {
            get: function () {
                return this.el.currentTime;
            },
            set: function (val) {
                this.el.currentTime = val;
            }
        },
        volume: {
            get: function () {
                return this.el.volume;
            },
            set: function (val) {
                this.el.volume = val;
            }
        }
    });



    // Unlike audio, video object is passed by user.
    var Video = exports.Video = Base.extend({

        constructor: function Video(video) {
            this.callSuper();
            this.el = video;
        }

    });

    exports.video = Class.module(function (exports) {
        exports.create = function (video) {
            return new Video(video);
        }
    });

});