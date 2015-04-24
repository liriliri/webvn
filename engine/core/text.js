/* Module text
 * All effects about text, such as animation is defined here
 */

webvn.module('text', ['util', 'class', 'select'],
    function (s, util, kclass, select) {
        
        var exports = {};

        var TextAnim = exports.TextAnim = kclass.create({
            constructor: function TextAnim(el) {

                // If the element is a dom node, pass it into a select element
                if (!select.isSelect(el)) {
                    el = select(el);
                }

                this.$el = el;
                this.data = '';
                this.length = 0;
                this.type = 'fadeIn';
                this.duration = 50;
                this.timers = [];

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

                this.$el.html(this.splitText(this.data));
                this.$el.find('span').hide();
                for (var i = 0; i < this.length; i++) {
                    this.showChar(i);
                }

            },
            showChar: function (i) {

                var self = this,
                    animDuration = this.duration / 100 + 's';

                this.timers[i] = setTimeout(function () {

                    self.$el.find('.char' + i).show().css({
                        '-webkit-animation-duration': animDuration,
                        'display': 'inline-block'
                    }).addClass(self.type);

                    self.timers[i] = null;

                }, i * this.duration);

            },
            // Split text into different span
            // TODO use template to replace it when template module is completed
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

        return exports;

    });