// 下雪效果
define(function () {

var isInit = false,
	canvas = null,
	w, h,
	ctx = null,
	particles = [],
	max = 15,
	circle = Math.PI * 2,
	angle = 0,
	i, p;

function draw() {
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for (i = 0; i < max; i++) {
        p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, circle, true);
    }
    ctx.fill();
    ctx.closePath();
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

	for (i = 0; i < max; i++) {
        particles.push({
            x: Math.random() * c.width, // x坐标
            y: Math.random() * c.height, // y坐标
            r: Math.random() * 5, // 半径
            d: Math.random() * max // 密度
        });
    }

	isInit = true;
}

// 更新
function update() {
    angle += 0.001;
    for (i = 0; i < max; i++) {
        p = particles[i];
        p.y += Math.cos(angle + p.d) + 1 + p.r/2;
        p.x += Math.sin(angle) * 2;
        if (p.x > w + 5 || p.x < -5 || p.y > h) {
            if (i % 3 > 0) {
                particles[i] = {x: Math.random() * w, y: -10, r: p.r, d: p.d};
            } else {
                if (Math.sin(angle) > 0) {
                    particles[i] = {x: -5, y: Math.random() * h, r: p.r, d: p.d};
                } else {
                    particles[i] = {x: w + 5, y: Math.random() * h, r: p.r, d: p.d};
                }
            }
        }
    }
}

return {
	draw: draw,
	init: init
}

});