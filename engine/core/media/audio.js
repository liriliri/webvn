WebVN.extend('media', function (exports, storage, config)
{
    var Base  = exports.Base,
        asset = storage.asset,
        State = exports.State;

    /**
     * Append class in order not to conflict with primitive Audio class.
     * @class AudioClass
     * @memberof media
     * @extends media.Base
     */
    var AudioClass = exports.AudioClass = Base.extend(
        /** @lends media.AudioClass.prototype */
        {
            constructor: function AudioClass()
            {
                this.callSuper();

                this.el       = new Audio;
                this.duration = 0;
                this.fadeIn   = false;
                this.fadeOut  = false;
            },

            load: function (src, autoplay)
            {
                if (autoplay === undefined) autoplay = true;

                var self = this;

                // Stop playing music
                this.stop();
                this.state.unload();

                var el = this.el;

                // Autoplay init
                if (autoplay)
                {
                    el.onloadeddata = function ()
                    {
                        self.duration = self.el.duration;
                        self.state.pause();
                        self.play();
                    };
                } else
                {
                    el.onloadeddata = function ()
                    {
                        self.duration = self.el.duration;
                        self.state.pause();
                    }
                }

                // Start loading
                this.asset ? el.src = this.asset.get(src)
                           : el.src = src;
            },

            play: function ()
            {
                this.callSuper();

                if (this.fadeIn)
                {
                    this._stopTween();
                    var self = this;
                    this._volume = this.volume();
                    this.volume(0);
                    this._anim = anim.create(this.el).to({
                        volume: this._volume
                    }, this.duration).call(function () { self._anim = null });
                }
            },

            pause: function ()
            {
                var self = this;

                if (!this.state.is('play')) return;

                if (this.fadeOut)
                {
                    this._stopTween();
                    this.state   = STATE.FADE_OUT;
                    this._volume = this.volume();
                    this._anim = anim.create(this.el).to({
                        volume: 0
                    }, this.duration).call(function ()
                    {
                        self._anim = null;
                        self.volume(self._volume);
                        self.el.pause();
                        self.state.pause();
                    });
                } else
                {
                    this.el.pause();
                    this.state.pause();
                }
            },

            _stopTween: function ()
            {
                if (this._anim)
                {
                    this._anim.stop();
                    this.volume(this._volume);
                }
            }

    });

    var audio = exports.audio = WebVN.module(function (exports)
    {
        var audios = {};

        exports.create = function (name)
        {
            if (audios[name]) return audios[name];

            audios[name] = new AudioClass();

            return audios[name];
        };

        exports.get = function (name) { return audios[name]};
    });

    var cfg = config.create('media');

    var cfgBgm = cfg.get('bgm'),
        bgm    = audio.create('bgm');

    bgm.asset    = asset.create(cfgBgm.path, cfgBgm.extension);
    bgm.loop     = true;
    bgm.duration = 2000;
    bgm.volume   = cfgBgm.volume;

    var cfgSe = cfg.get('se'),
        se    = audio.create('se');

    se.asset  = asset.create(cfgSe.path, cfgSe.extension);
    se.volume = cfgSe.volume;

    var cfgVo = cfg.get('vo'),
        vo    = audio.create('vo');

    vo.asset  = asset.create(cfgVo.path, cfgVo.extension);
    vo.volume = cfgVo.volume;
});