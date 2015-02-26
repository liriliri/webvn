// Dialog ui component

webvn.use(['ui'], function (s, ui) {

var dialog = ui.create('dialog', 'div'),
    $ele = dialog.$ele;

$ele.addClass('fill');

var tpl = '<div class="name"></div>' +
    '<div class="content">' +
        '<img class="face" src=""/>' +
        '<span class="text"></span>' +
    '</div>';

dialog.body(tpl);

var $content = $ele.find('.content'),
    $name = $ele.find('.name'),
    $face = $content.find('.face'),
    $text = $content.find('.text');

// Clear text
dialog.clear = function () {

    $text.html('');

};

// Set or get name
dialog.name = function (str) {

    if (str) {
        $name.html(str);
    } else {
        return $name.html();
    }

};

// Set or get text
dialog.text = function (str) {

    if (str) {
        $text.html(str);
    } else {
        return $text.html();
    }

};


});