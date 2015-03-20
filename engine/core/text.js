/* Module text
 * All effects about text, such as animation is defined here
 */

webvn.add('text', ['util', 'class', 'select'],
    function (s, util, kclass, select) {
        
        var exports = {};

        // TODO text animation effect
        var TextAnim = exports.TextAnim = kclass.create({
            constructor: function TextAnim(el) {

                // If the element is a dom node, pass it into a select element
                if (!select.isSelect(el)) {
                    el = select(el);
                }

                this.$el = el;
                this.data = '';
                this.duration = 50;

            },
            load: function (data, autoshow) {

                if (autoshow === undefined) {
                    autoshow = true;
                }

                this.data = data;
                this.length = data.length;
                if (autoshow) {
                    this.show();
                }

            },
            show: function () {

                this.$el.html(this.splitText(this.data));
                this.$el.find('span').hide();
                var self = this;
                for (var i = 0; i < this.length; i++) {
                    this.doSetTimeout(i, i * this.duration);
                }

            },
            hide: function () {



            },
            doSetTimeout: function (i, delay) {

                var self = this;
                setTimeout(function () {

                    self.$el.find('.char' + i).show().css({
                        '-webkit-animation-duration': '.5s',
                        'display': 'inline-block'
                    }).addClass('fadeIn');

                }, delay);

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

            }
        });

        exports.createAnim = function (el) {

            return new TextAnim(el);

        };

        return exports;

    });