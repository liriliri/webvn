/**
 * @namespace text
 */
WebVN.module('text', function (exports, util, Class, select, state)
{
    var State = state.create('pause', [
        { name: 'play',  from: 'pause',  to: 'play' },
        { name: 'end',   from: 'play',   to: 'finish'},
        { name: 'reset', from: 'finish', to: 'pause'}
    ]);

    /**
     * @class TextAnim
     * @memberof text
     */
    var TextAnim = exports.TextAnim = Class.create(
        {
            constructor: function TextAnim($target)
            {
                if (!select.isSelect($target)) $target = select($target);

                this.$target  = $target;
                this.data     = '';
                this.length   = 0;
                this.type     = 'fadeIn';
                this.duration = 50;
                this.timers   = [];
                this.state    = new State;
            },

            load: function (data, autoplay)
            {
                if (autoplay === undefined) autoplay = true;

                this.stopTimer();

                this.data   = data;
                this.length = data.length;
                if (autoplay) this.play();
            },

            play: function ()
            {
                var len = this.length,
                    self = this,
                    $target = this.$target;

                this.isPlaying = true;

                $target.html = this.splitText(this.data);

                var $span = $target.find('span');
                $span.hide();

                for (var i = 0; i < len; i++) {
                    this.showChar(i);
                }

                // Remove everything when done
                setTimeout(function () {
                    self.stop();
                }, (this.duration / 10) * i + this.duration);
            },

            showChar: function (i)
            {
                var self = this,
                    animDuration = this.duration / 1000 + 's';

                this.timers[i] = setTimeout(function () {

                    self.$target.find('.char' + i).css('display', 'inline-block').css({
                        '-webkit-animation-duration': animDuration
                    }).addClass(self.type);

                    self.timers[i] = null;

                }, i * (this.duration / 10));
            },

            // Split text into different span
            splitText: function (data)
            {
                var ret = '';

                for (var i = 0, len = data.length; i < len; i++) {
                    var char = data[i];
                    if (char === ' ') {
                        char = '&nbsp;';
                    }
                    ret += '<span class="char' + i + '">' + char + '</span>';
                }

                return ret;
            },

            isStop: function ()
            {
                return !this.isPlaying;
            },

            stop: function ()
            {
                this.isPlaying = false;
                this.stopTimer();
                this.$target.find('span').show().rmAttr('class');
            },

            stopTimer: function ()
            {
                for (var i = 0; i < this.length; i++) {
                    if (this.timers[i]) {
                        clearTimeout(this.timers[i]);
                        this.timers[i] = null;
                    }
                }
            }
        }
    );

    exports.createAnim = function (target) { return new TextAnim(target) };
});