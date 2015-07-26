/**
 * @namespace media
 */
WebVN.module('media', function (exports, Class, log, util, module)
{
    var State = Class.State.create('empty', [
        { name: 'load',   from: 'empty', to: 'pause' },
        { name: 'play',   from: 'pause', to: 'play' },
        { name: 'pause',  from: ['play', 'empty'], to: 'pause' },
        { name: 'unload', from: ['play', 'pause'], to: 'empty' }
    ]);

    /**
     * @class Base
     * @memberof media
     * @extends Class.Base
     * @property state
     */
    var Base = exports.Base = Class.create(
        /** @lends media.Base.prototype */
        {
            constructor: function Base()
            {
                this.state = new State;
                this.el    = null;
            },

            /**
             * Media is loaded or not.
             * @method
             * @return {Boolean}
             */
            isLoaded: function ()
            {
                return !this.state.is('empty');
            },

            /**
             * @method
             * @param {string} src
             * @param {boolean} autoplay
             */
            load: function (src, autoplay)
            {
                if (autoplay === undefined) autoplay = true;

                var self = this;
                // Stop playing music
                this.stop();

                this.state.unload();
                // AutoPlay init
                if (autoplay)
                {
                    this.el.onloadeddata = function ()
                    {
                        self.state.pause();
                        self.play();
                    };
                } else {
                    this.el.onloadeddata = function ()
                    {
                        self.state.pause();
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
                if (this.state.is('play'))
                {
                    this.el.pause();
                    this.state.pause();
                }
            },

            /**
             * @method
             */
            play: function ()
            {
                if (this.state.is('pause'))
                {
                    this.el.play();
                    this.state.play();
                }
            },

            /**
             * @method
             */
            isPlaying: function ()
            {
                return this.state.is('play');
            },

            /**
             * @method
             */
            stop: function ()
            {
                if (!this.state.is('empty'))
                {
                    this.curTime = 0;
                    this.pause();
                    this.state.pause();
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

    exports.video = module(function (exports)
    {
        exports.create = function (video) { return new Video(video) }
    });
});