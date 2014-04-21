// 背景
define(['config', 'game/name'], function(config, name) {

var $dialog = $('#dialog'),
	$dialogName = $('#dialog-name'),
	$dialogText = $('#dialog-text'),
    isTyping = false, // 是否正在显示打字效果
    typeInterval = 1000 / config.TEXT_SPEED,
    typePos = 0,
    typeTimer = null,
    text = '', // 文本内容
    textLen = 0;

// 清除文本内容
function clear() {
    $dialogText.html('');
}

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
function setText(str) {
    // 如果还是在打印文字中，则返回false
    if (isTyping === true) {
        isTyping = false;
        $dialogText.html(text);
        clearTimeout(typeTimer);
        return false;
    }

    text = str;
    textLen = str.length;
    typePos = 0;
	clear();
    isTyping = true;
    type();
}

// 显示
function show() {
	$dialog.removeClass('hidden');
}

// 打字
function type() {
    if (text[typePos]) {
        $dialogText.html($dialogText.html() + text[typePos++]);
    }
    // 如果还没打印完毕，就继续执行
    if (typePos < textLen) {
        typeTimer = setTimeout(type, typeInterval);
    } else {
        isTyping = false;
    }
}

return {
	hide: hide,
	setName: setName,
    setStyle: setStyle,
    setText: setText,
    show: show
}

});