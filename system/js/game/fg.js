// 立绘模块
define(['config', 'game/name'], function (config, url) {

var $figure = $('#figure'),
	figureNum = config.FIGURE_NUM,
	figures = [], i, append = '', p, current = 0,
	animationDuration = config.ANIMATION_DURATION,
	screenWidth = config.SCREEN_WIDTH,
	screenHeight = config.SCREEN_Height;

function Figure(i) {
	this.source = $('#fg' + i);
	this.image = new Image();
	this.position = '中';
	this.rx = 0;
	this.cx = 0;
	this.image.onload = $.proxy(function () {
		this.source.attr('src', this.image.src);
		this.source.css('top', (screenHeight - this.image.height) + 'px');
		this.rx = screenWidth - this.image.width;
		this.cx = this.rx / 2;
		this.repaintPostion();
	}, this);
}

p = Figure.prototype;

p.load = function (name, type) {
	this.image.src = url.fg(name, type);
}

p.fadeIn = function () {
	this.source.fadeIn(animationDuration);
}

p.fadeOut = function () {
	this.source.fadeOut(animationDuration);
}

p.repaintPostion = function () {
	switch (this.position) {
	case '左':
		this.source.css('left', '0px');
		break;
	case '中':
		this.source.css('left', this.cx + 'px');
		break;
	case '右':
		this.source.css('left', this.rx + 'px');
		break;
	default:
		this.source.css('left', this.position + 'px');
		break;
	}
}

p.setPosition = function (x) {
	this.position = x;
	this.repaintPostion();
}

// 新建立绘对象
for (i = 0; i < figureNum; i++) {
	append += '<img id="fg' + i + '" class="hidden"/>';
}
$figure.html(append);
for (i = 0; i < figureNum; i++) {
	figures[i] = new Figure(i);
}

// 加载
function load(name, type) {
	figures[current].load(name, type);
}

// 显示
function fadeIn() {
	figures[current].fadeIn();
}

// 隐藏
function fadeOut() {
	figures[current].fadeOut();
}

// 选择
function select(num) {
	if (num < figureNum) {
		current = num;
	}
}

// 设置位置
function setPosition(x) {
	figures[current].setPosition(x);
}

return {
	fadeIn: fadeIn,
	fadeOut: fadeOut,
	load: load,
	select: select,
	setPosition: setPosition
}

});