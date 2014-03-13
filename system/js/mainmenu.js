// 主菜单
define(['config', 'sound/bgm', 'game', 'cg', 'music'], function(config, bgm, game, cg, music) {

var $mainmenu = $('#mainmenu'),
    $startGame = $('#start-game'),
    $cgMode = $('#cg-mode'),
    $musicMode = $('#music-mode'),
    animationDuration = config.ANIMATION_DURATION,
    bgmOrNot = config.MAINMENU_BGM_OR_NOT;
    mainmenuBgm = config.MAINMENU_BGM_NAME;

// 绑定按钮
$startGame.on('click', function () {
    fadeOut();
    bgm.stop();
    game.start();
});

$cgMode.on('click', function () {
    cg.fadeIn();
});

$musicMode.on('click', function () {
    // 先暂停背景乐
    bgm.stop();
    music.fadeIn();
});

// 显示
function fadeIn() {
    $mainmenu.fadeIn(animationDuration);
    playBgm();
}

// 隐藏
function fadeOut() {
    $mainmenu.fadeOut(animationDuration);
}

// 播放背景乐
function playBgm() {
    if (bgmOrNot) {
        bgm.loadAndPlay(mainmenuBgm);
    }
}

return {
    fadeIn: fadeIn,
    fadeOut: fadeOut
}

});