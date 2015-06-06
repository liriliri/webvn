WebVN.module('text', function (exports, util, Class, select)
{
    var TextAnim = exports.TextAnim = Class.create({

        constructor: function TextAnim($el) {

            // If the element is a dom node, pass it into a select element
            if (!select.isSelect($el)) {
                $el = select($el);
            }

            this.$el = $el;
            this.data = '';
            this.length = 0;
            this.type = 'fadeIn';
            this.duration = 50;
            this.timers = [];
            this.isPlaying = false;

        },

        load: function (data, autoshow) {

            if (autoshow === undefined) {
                autoshow = true;
            }

            this.stopTimer();

            this.data = data;
            this.length = data.length;
            if (autoshow) {
                this.show();
            }

        },

        show: function () {
            var len = this.length,
                self = this,
                $el = this.$el;

            this.isPlaying = true;

            $el.html = this.splitText(this.data);

            var $span = $el.find('span');
            $span.hide();

            for (var i = 0; i < len; i++) {
                this.showChar(i);
            }

            // Remove everything when done
            setTimeout(function () {
                self.stop();
            }, (this.duration / 10) * i + this.duration);

        },

        showChar: function (i) {

            var self = this,
                animDuration = this.duration / 1000 + 's';

            this.timers[i] = setTimeout(function () {

                self.$el.find('.char' + i).css('display', 'inline-block').css({
                    '-webkit-animation-duration': animDuration
                }).addClass(self.type);

                self.timers[i] = null;

            }, i * (this.duration / 10));

        },

        // Split text into different span
        splitText: function (data) {

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

        isStop: function () {
            return !this.isPlaying;
        },

        stop: function () {
            this.isPlaying = false;
            this.stopTimer();
            this.$el.find('span').show().rmAttr('class');
        },

        stopTimer: function () {

            for (var i = 0; i < this.length; i++) {
                if (this.timers[i]) {
                    clearTimeout(this.timers[i]);
                    this.timers[i] = null;
                }
            }

        }
    });

    exports.createAnim = function (el) {
        return new TextAnim(el);
    };
});