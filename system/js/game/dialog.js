// 背景
define(['config', 'game/name'], function(config, name) {

var $dialog = $('#dialog');

// 隐藏
function hide() {
	$dialog.addClass('hidden');
}

// 设置样式
function setStyle(className) {
    $dialog.removeClass().addClass(name.dialogStyle(className));
}

// 显示
function show() {
	$dialog.removeClass('hidden');
}

return {
	hide: hide,
    setStyle: setStyle,
    show: show
}

});