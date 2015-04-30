webvn.use(['ui', 'select'],
    function (s, ui, select) {
        "use strict";
        var exports = ui.create('cg', 'div'),
            $el = exports.$el;
        var tpl = ui.getTemplate('cg');
        exports.body(tpl);

        $el.addClass('fill');

        var $viewer = $el.find('.viewer');
        $viewer.on('click', function () {
            var $this = select.get(this);
            $this.fadeOut(300);
        });

        exports.event({
            'click .close': function () {
                hide();
            },
            'click li img': function () {
                var $this = select.get(this),
                    src = $this.attr('src');
                $viewer.find('img').attr('src', src);
                $viewer.removeClass('hidden').fadeIn(300);
            }
        });

        exports.show = function () {
            $el.fadeIn(300);
        };

        var hide = exports.hide = function () {
            $el.fadeOut(300);
        };
    });