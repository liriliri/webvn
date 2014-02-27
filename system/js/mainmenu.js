// 主菜单
define(['config', 'sound/bgm'], function(config, bgm) {

var $mainmenu = $('#mainmenu'),
    animationDuration = config.ANIMATION_DURATION,
    bgmOrNot = config.MAINMENU_BGM_OR_NOT;
    mainmenuBgm = config.MAINMENU_BGM_NAME;

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