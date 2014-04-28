// 音乐鉴赏模块
define(['config', 'script/macro', 'util',
	'sound/bgm'], function (config, macro, util, bgm) {

var $musicPlayer = $('#music-player'),
	$closeBtn = $('#music-player .close'),
	$musicContainer = $('#music-container'),
	$current = null,
	$progress = $('#music-progress'), x,
	$progressInside = $progress.find('span'),
	persent = 0,
	music = util.getValue(macro.BGM), i,
	append = '', len,
    audio = bgm.audio,
	animationDuration = config.ANIMATION_DURATION;
	isPlaying = false,
	bgmOrNot = config.MAINMENU_BGM_OR_NOT,
    mainmenuBgm = config.MAINMENU_BGM_NAME;

// 载入音乐
for (i = 0, len = music.length; i < len; i++) {
	append += '<li data-name="' + music[i].value + '">' + music[i].name + '</li>';
}
$musicContainer.html(append);

// 绑定按钮
$closeBtn.on('click', function () {
	fadeOut();
});

$musicContainer.on('click', 'li', function () {
	var name = $(this).attr('data-name');
	if ($current) {
		$current.removeClass('playing');
	}
	$(this).addClass('playing');
	$current = $(this);
	bgm.loadAndPlay(name);
	isPlaying = true;
});

// 绑定进度条
$progress.on('click', function(e) {
	if (isPlaying === false) {
		return;
	}
	x = e.offsetX;
	persent = util.ceil(x / $progress.width(), 2);
	bgm.setCurrentTime(audio.duration * persent);
});

function fadeIn() {
	$musicPlayer.fadeIn(animationDuration);
	init();
}

function fadeOut() {
	$musicPlayer.fadeOut(animationDuration);
	reset();
}

function init() {
	audio.addEventListener("timeupdate", updateProgressBar, false);
	isPlaying = false;
}

function reset() {
	bgm.stop();
	if ($current) {
		$current.removeClass('playing');
	}
	$progressInside.css('width', '0%');
	audio.removeEventListener('timeupdate', updateProgressBar, false);
	// 如果有主菜单背景乐则进行播放
	if (bgmOrNot) {
        bgm.loadAndPlay(mainmenuBgm);
    }
}

function updateProgressBar() {
	persent = util.ceil(audio.currentTime / audio.duration * 100, 2);
	$progressInside.css('width', persent + '%');
}

return {
	fadeIn: fadeIn,
	fadeOut: fadeOut
}

});