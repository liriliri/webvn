// CG查看模块
define(['config', 'game/name', 'script/macro'], function (config, url, macro) {

var $cgViewer = $('#cg-viewer'),
	$closeBtn = $('#cg-viewer .close'),
	$cgContainer = $('#cg-container'),
	$cgPicture = $('#cg-picture'),
	append = '',
	cg = macro.CG, i
	animationDuration = config.ANIMATION_DURATION;

// 载入CG
for (i = 0; i < cg.length; i++) {
	append += '<li><img src="' + url.cg(cg[i]) + '"/></li>';
}
$cgContainer.html(append);

// 绑定按钮
$closeBtn.on('click', function () {
	fadeOut();
});

$cgPicture.on('click', function () {
	$(this).fadeOut(animationDuration);
});

$cgContainer.on('click', 'img', function () {
	$cgPicture.attr('src', $(this).attr('src')).fadeIn(animationDuration);
});

function fadeIn() {
	$cgViewer.fadeIn(animationDuration);
}

function fadeOut() {
	$cgViewer.fadeOut(animationDuration);
}

return {
	fadeIn: fadeIn,
	fadeOut: fadeOut
}

});