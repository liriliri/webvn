// Dialog ui component

webvn.use(['ui', 'text'],
    function (s, ui, text) {

        var exports = ui.create('dialog', 'div');

        var $el = exports.$el;
        $el.addClass('fill');

        var tpl = [
                '<div class="name"></div>',
                '<div class="content">',
                    '<img class="face" src=""/>',
                    '<span class="text"></span>',
                '</div>'
            ].join('');
        exports.body(tpl);

        var $content = $el.find('.content'),
            $name = $el.find('.name'),
            $text = $content.find('.text');

        exports.clear = function () {

            $text.html('');

        };

        exports.name = function (str) {

            $name.html('【' + str + '】');

        };

        var textAnim = text.createAnim($text);
        exports.text = function (str) {

                textAnim.load(str);

        };

    });