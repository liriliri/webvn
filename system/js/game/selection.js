// 选择框
define(['config', 'connector'], function (config, connector) {

var $selection = $('#selection'),
    $selectionContainer = $('#selection-container'),
    animationDuration = config.ANIMATION_DURATION,
    i, len, html = '', target = '';

// 显示
function fadeIn() {
    $selection.fadeIn(animationDuration);
}

// 隐藏
function fadeOut() {
    $selection.fadeOut(animationDuration);
}

// 设置选项
function setSelections(selections) {
    html = '';
    for (i = 0, len = selections.length; i < len; i++) {
        html += '<li data-target="' + selections[i]['target'] + '">' + selections[i]['title'] + '</li>';
    }
    $selectionContainer.html(html);
    fadeIn();
}

$selectionContainer.on('click', 'li', function () {
    target = $(this).attr('data-target');

    switch (target) {
    case '主菜单':
        connector.trigger('showMainmenu');
        break;
    default:
        break;
    };

    if (isNaN(Number(target))) {
        connector.trigger('jumpToLabel', target);
    } else {
        connector.trigger('execute', Number(target));
    }
    fadeOut();
});

return {
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    setSelections: setSelections
}

});