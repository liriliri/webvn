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
            $this.fadeOut();
        });

        exports.event({
            'click .close': function () {
                hide();
            },
            'click img': function () {
                var $this = select.get(this),
                    src = $this.attr('src');
                $viewer.attr('src', src).fadeIn();
            }
        });

        exports.show = function () {
            $el.fadeIn();
        };

        var hide = exports.hide = function () {
            $el.fadeOut();
        };
    });