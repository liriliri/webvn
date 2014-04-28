// 顶部菜单栏
define(['config', 'screen', 'nav/option'], function(config, screen, option) {

var $nav = $('#nav'),
    $windowMode = $('#window-mode'),
    $gameOption = $('#game-option'),
    $loadGame = $('#load-game'),
    $saveGame = $('#save-game');

// 绑定游戏选项按钮
$gameOption.on('click', function () {
    option.toggle();
});

// 右键显示隐藏菜单栏
function toggleNav(e) {
    e.preventDefault();
    $nav.toggleClass('hide');
}
$(document).on('contextmenu', toggleNav);

// 全屏窗口模式切换
function toggleFullscreen() {
    screen.toggleFullscreen();
    if (screen.isFullscreen()) {
        $(this).text('窗口');
    } else {
        $(this).text('全屏');
    }
    $nav.toggleClass('hide');
}

if (config.NAV_WINDOW_MODE) {
    $windowMode.removeClass('hidden').on('click', toggleFullscreen);
}
if (config.NAV_GAME_OPTION) {
    $gameOption.removeClass('hidden');
}
if (config.NAV_LOAD_GAME) {
    $loadGame.removeClass('hidden');
}
if (config.NAV_SAVE_GAME) {
    $saveGame.removeClass('hidden');
}

});