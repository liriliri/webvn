/**
 * @namespace media
 */
WebVN.module('media', function (exports, Class, log, util)
{
    // Const variables
    var STATE = exports.STATE = {
        NOT_LOADED: 0,
        PAUSE     : 1,
        PLAY      : 2
    };

    /**
     * @class Base
     * @memberof media
     * @extends Class.Base
     */
    var Base = exports.Base = Class.create(
        /** @lends media.Base.prototype */
        {
            constructor: function Base()
            {
                this.state = STATE.NOT_LOADED;
                this.el    = null;
            },

            /**
             * Media is loaded or not.
             * @method
             * @return {Boolean}
             */
            isLoaded: function ()
            {
                return this.state !== STATE.NOT_LOADED;
            },

            /**
             * @method
             * @param {string} src
             * @param {boolean} autoplay
             */
            load: function (src, autoplay)
            {
                if (autoplay === undefined) autoPlay = true;

                var self = this;
                // Stop playing music
                this.stop();
                this.state = STATE.NOT_LOADED;
                // AutoPlay init
                if (autoplay)
                {
                    this.el.onloadeddata = function ()
                    {
                        self.state = STATE.PAUSE;
                        self.play();
                    };
                } else {
                    this.el.onloadeddata = function ()
                    {
                        self.state = STATE.PAUSE;
                    }
                }
                // Start loading
                this.el.src = src;
            },

            /**
             * @method
             */
            pause: function ()
            {
                if (this.state === STATE.PLAY)
                {
                    this.el.pause();
                    this.state = STATE.PAUSE;
                }
            },

            /**
             * @method
             */
            play: function ()
            {
                if (this.state === STATE.PAUSE)
                {
                    this.el.play();
                    this.state = STATE.PLAY;
                }
            },

            /**
             * @method
             */
            isPlaying: function ()
            {
                return this.state === STATE.PLAY;
            },

            /**
             * @method
             */
            stop: function ()
            {
                if (this.state !== STATE.NOT_LOADED)
                {
                    this.curTime = 0;
                    this.pause();
                    this.state = STATE.PAUSE;
                }
            },

            /**
             * @method
             */
            events: function (events)
            {
                var self = this;

                util.each(events, function (fn, type) { self.el['on' + type] = fn });
            }

    }, {

        loop: {
            get: function () { return this.el.loop },
            set: function (val) { this.el.loop = val }
        },

        curTime: {
            get: function () { return this.el.currentTime },
            set: function (val) { this.el.currentTime = val }
        },

        volume: {
            get: function () { return this.el.volume },
            set: function (val) { this.el.volume = val }
        }

    });

    /**
     * @class Video
     * @memberof media
     * @extends media.Base
     */
    var Video = exports.Video = Base.extend(
        /** @lends media.Video.prototype */
        {
            constructor: function Video(video)
            {
                this.callSuper();
                this.el = video;
            }
        }
    );

    exports.video = WebVN.module(function (exports)
    {
        exports.create = function (video) { return new Video(video) }
    });
});