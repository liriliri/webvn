// 点击区
define(['connector'], function (connector) {

var $clickArea = $('#click-area');

$clickArea.on('click', function () {
    connector.trigger('gameClicked');
});

// 快捷键
$(document).on('keypress', function (e) {
    // 如果是按回车键或空格则触发点击事件
    if (e.keyCode === 13 || e.keyCode === 32) {
        connector.trigger('gameClicked');
    }
});

});