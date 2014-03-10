// 特效层
define(['config', 'game/fog', 'game/rain', 'game/snow'], function (config, fog, rain, snow) {

var $canvas = $('#effect'),
	canvas = $canvas[0],
	ctx = canvas.getContext('2d'),
	currentEffect = null,
	interval = 1000 / config.FRAME_RATE,
	isAnimated = false;

// 初始化画布大小
canvas.width = config.SCREEN_WIDTH;
canvas.height = config.SCREEN_HEIGHT;

// 开始绘制
function begin() {
	isAnimated = true;
	draw();
}

// 清除画布
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 绘制
function draw() {
	clear();
	if (currentEffect) {
		currentEffect.draw();
	}
	if (isAnimated) {
		setTimeout(draw, interval);
	}
}

// 隐藏
function hide() {
	$canvas.addClass('hidden');
}

// 设置样式
function setEffect(name) {
	switch(name) {
	case 'fog':
		currentEffect = fog;
		break;
	case 'rain':
		currentEffect = rain;
		break;
	case 'snow':
		currentEffect = snow;
		break;
	default:
		break;
	}
	currentEffect.init(canvas);
	show();
	begin();
}

// 显示
function show() {
	$canvas.removeClass('hidden');
}

// 停止绘制
function stop() {
	isAnimated = false;
	hide();
}

return {
	setEffect: setEffect,
	stop: stop
}

});