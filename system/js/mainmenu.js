// 主菜单
define(['config', 'sound/bgm', 'game'], function(config, bgm, game) {

var $mainmenu = $('#mainmenu'),
    $startGame = $('#start-game'),
    animationDuration = config.ANIMATION_DURATION,
    bgmOrNot = config.MAINMENU_BGM_OR_NOT;
    mainmenuBgm = config.MAINMENU_BGM_NAME;

// 绑定按钮
$startGame.on('click', function() {
    fadeOut();
    game.start();
});

// 显示
function fadeIn() {
    $mainmenu.removeClass('hidden').fadeIn(animationDuration);
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