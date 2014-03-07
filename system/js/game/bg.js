// 背景
define(['game/name', 'game/transition', 'config'], function(url, Transition, config) {

var $bg = $('#bg'),
    $img = $bg.find('img'),
    trans = new Transition($bg, $img);

// 初始化过渡器
trans.init(config.BG_TRANS_TIME, config.BG_TRANS_TYPE);

// 隐藏
function hide() {
	$bg.addClass('hidden');
}

// 加载图片
function load(name) {
    trans.run(url.bg(name));
}

// 设置过渡时间
function setTransTime(time) {
    trans.setDuration(time);
}

// 设置过渡类型
function setTransType(type) {
    trans.setType(type);
}

// 显示
function show() {
	$bg.removeClass('hidden');
}

return {
	hide: hide,
    load: load,
    setTransTime: setTransTime,
    setTransType: setTransType,
    show: show
}

});