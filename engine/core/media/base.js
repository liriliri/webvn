/**
 * @module media
 */
WebVN.module('media', function (exports, Class, log, util, anim, config, storage)
{
    // Const variables
    var STATE = exports.STATE = {
        NOT_LOADED: 0,
        PAUSE: 1,
        PLAY: 2
    };

    /**
     * @class Base
     */
    var Base = exports.Base = Class.create({

        /**
         * @constructor
         */
        constructor: function Base() {
            this.state = STATE.NOT_LOADED;
            this.el = null;
        },

        /**
         * @method isLoaded
         * @return {Boolean}
         */
        isLoaded: function () {
            return this.state !== STATE.NOT_LOADED;
        },

        /**
         * @method load
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
         * @method pause
         */
        pause: function () {
            if (this.state === STATE.PLAY) {
                this.el.pause();
                this.state = STATE.PAUSE;
            }
        },

        /**
         * @method play
         */
        play: function () {
            if (this.state === STATE.PAUSE) {
                this.el.play();
                this.state = STATE.PLAY;
            }
        },

        /**
         * @method isPlaying
         */
        isPlaying: function () {
            return this.state === STATE.PLAY;
        },

        /**
         * @method stop
         */
        stop: function () {
            if (this.state !== STATE.NOT_LOADED)
            {
                this.curTime = 0;
                this.pause();
                this.state = STATE.PAUSE;
            }
        },

        /**
         * @method events
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
            get: function ()
            {
                return this.el.currentTime;
            },
            set: function (val)
            {
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

    /**
     * @class Video
     * @extends Base
     */
    var Video = exports.Video = Base.extend({

        constructor: function Video(video) {
            this.callSuper();
            this.el = video;
        }

    });

    exports.video = WebVN.module(function (exports) {
        exports.create = function (video) {
            return new Video(video);
        }
    });

});