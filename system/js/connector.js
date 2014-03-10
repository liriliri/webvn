// 元素事件连接器
define(['game'], function (game) {

var $clickArea = $('#click-area');

// 绑定点击画面事件
$clickArea.on('click', game.execute);

});