// 背景
define(['config', 'game/name'], function(config, name) {

var $dialog = $('#dialog'),
	$dialogName = $('#dialog-name'),
	$dialogText = $('#dialog-text');

// 隐藏
function hide() {
	$dialog.addClass('hidden');
}

// 设置名字
function setName(name) {
	$dialogName.html(name);
}

// 设置样式
function setStyle(className) {
    $dialog.removeClass().addClass(name.dialogStyle(className));
}

// 设置文字内容
function setText(text) {
	$dialogText.html(text);
}

// 显示
function show() {
	$dialog.removeClass('hidden');
}

return {
	hide: hide,
	setName: setName,
    setStyle: setStyle,
    setText: setText,
    show: show
}

});