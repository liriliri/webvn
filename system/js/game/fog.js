// 雾气效果
define(function () {

var isInit = false,
	canvas = null,
	w, h,
	ctx = null,
	max = null,
    speed = 0.5,
    x = [-500, 460],
    opacity = 0.5,
    url = 'system/img/fog.jpg', i;

function draw() {
	ctx.globalAlpha = opacity;
    ctx.drawImage(mask, x[0], 0);
    ctx.drawImage(mask, x[1], 0);
    ctx.globalAlpha = 1;
    update();
}

// 初始化
function init(c) {
	if (isInit === true) {
		return;
	}

	canvas = c;
	ctx = c.getContext('2d');
	w = canvas.width;
	h = canvas.height;

	mask = new Image();
    mask.src = url;

	isInit = true;
}

// 更新
function update() {
    x[0] += speed;
    x[1] += speed;
    for (i = 0; i < 2; i++) {
        if (x[i] >= 960) {
            x[i] = -960;
        }
    }
}

return {
	draw: draw,
	init: init
}

});