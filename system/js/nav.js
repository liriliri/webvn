// 顶部菜单栏
define(['screen'], function(screen) {

var $nav = $('#nav');

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
$nav.on('click', '#window-mode', toggleFullscreen);

});