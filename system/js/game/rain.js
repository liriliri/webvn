// 下雪效果
define(function () {

var isInit = false,
	canvas = null,
	w, h,
	ctx = null,
    lineWidth = 0.1,
	particles = [],
    maxLength = 100,
	number = 400,
    speed = 20,
	i, p;

function draw() {
	for (i = 0; i < number; i++) {
        p = particles[i];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.lineWidth = p.w;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.l);
        ctx.stroke();
        ctx.closePath();
    }
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

	for (i = 0; i < number; i++) {
        particles.push({
            x: Math.random() * w, // x坐标
            y: Math.random() * h, // y坐标
            l: Math.random() * maxLength, // 长度
            w: lineWidth // 线宽
        });
    }

	isInit = true;
}

// 更新
function update() {
    for (i = 0; i < number; i++) {
        p = particles[i];
        p.y = p.y + speed;
        if (p.y > h) {
            p.y = -maxLength;
        }
        p.l = Math.random() * maxLength;
    }
}

return {
	draw: draw,
	init: init
}

});