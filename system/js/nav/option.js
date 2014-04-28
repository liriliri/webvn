// 游戏选项模块
define(['config'], function (config) {

var $optionPanel = $('#option-panel'),
    $closeBtn = $('#option-panel .close'),
    animationDuration = config.ANIMATION_DURATION,
	isVisible = false;

// 绑定关闭按钮
$closeBtn.on('click', function () {
    fadeOut();
});
    
// 显示
function fadeIn() {
	$optionPanel.fadeIn(animationDuration);
	isVisible = true;
}

// 隐藏
function fadeOut() {
	$optionPanel.fadeOut(animationDuration);
	isVisible = false;
}

function toggle() {
	if (isVisible === false) {
		fadeIn();
	} else {
		fadeOut();
	}
}

return {
    fadeIn: fadeIn,
    fadeOut: fadeOut,
	toggle: toggle
}

});