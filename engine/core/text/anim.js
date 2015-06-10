/**
 * @namespace anim
 * @memberof text
 */
WebVN.extend('text', function (exports, util, Class, select, state, event)
{
    var State = state.create('pause', [
        { name: 'play',  from: 'pause',  to: 'play' },
        { name: 'pause', from: 'play',   to: 'pause'}
    ]);

    var regBracket = /\[|]/g;

    /**
     * @class Anim
     * @memberof text.anim
     * @property {Select} $target
     * @property text
     * @property duration
     * @property timers
     */
    var Anim = Class.create(
        /** @lends text.anim.Anim.prototype */
        {
            constructor: function TextAnim($target)
            {
                if (!select.isSelect($target)) $target = select($target);

                this.$target  = $target;
                this.text     = '';
                this.type     = 'fadeIn';
                this.duration = 50;
                this.timers   = [];
                this.style    = '';
                this.length   = 0;
                this.state    = new State;
            },

            show: function (text, autoplay)
            {
                if (autoplay === undefined) autoplay = true;

                this.text = text;

                if (autoplay) this.play();
            },

            play: function ()
            {
                var self     = this,
                    $target  = this.$target,
                    duration = this.duration,
                    len, i;

                this.state.play();

                $target.append(this.splitText());

                for (i = 0, len = this.length; i < len; i++) this.showChar(i);

                this.timers[i] = setTimeout(function ()
                {
                    self.stop();
                }, (duration / 10) * i + duration);
            },

            showChar: function (i)
            {
                var self         = this,
                    duration     = this.duration,
                    animDuration = duration / 1000 + 's';

                this.timers[i] = setTimeout(function ()
                {
                    self.$target.find('.char' + i)
                                .css({
                                    'display': 'inline-block',
                                    '-webkit-animation-duration': animDuration
                                })
                                .addClass(self.type);
                }, i * (duration / 10));
            },

            splitText: function ()
            {
                var ret     = '',
                    text    = this.text,
                    index   = 0,
                    style   = 'display:none',
                    i, len, char;

                var steps = text.split(regBracket);

                util.each(steps, function (val)
                {
                    if (util.trim(val) === '') return;

                    switch (val)
                    {
                        case 'br': ret += '<br>'; return;
                    }

                    for (i = 0, len = val.length; i < len; i++)
                    {
                        char = val[i];
                        char = replaceChar(char);
                        ret += '<span class="char' + (index++) + '" style="' +
                        style + '">' + char + '</span>';
                    }
                });

                this.length = index;

                return ret;
            },

            isPlaying: function ()
            {
                return this.state.is('play');
            },

            stop: function ()
            {
                this.state.pause();

                this.clearTimers();

                this.$target.find('span').show().rmAttr('class');
            },

            clearTimers: function ()
            {
                var len = this.length,
                    i;

                for (i = 0; i <= len; i++) clearTimeout(this.timers[i]);
            }
        }
    );

    function replaceChar(char)
    {
        switch (char)
        {
            case ' ': return '&nbsp';
            default: return char;
        }
    }

    function create($target) { return new Anim($target) }

    exports.anim = {
        create: create
    };
});