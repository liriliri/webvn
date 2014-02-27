// 窗口模块
define(['config', 'util'], function(config, util) {

var $gameContainer = $('#game-container'), // 游戏容器
    $title = $('title'),
    $window = $(window),
    screenWidth = config.SCREEN_WIDTH,
    screenHeight = config.SCREEN_HEIGHT,
    screenRatio = screenWidth / screenHeight;

// 初始化游戏容器的宽高
$gameContainer.css({
    width: screenWidth + 'px',
    height: screenHeight + 'px',
    left: -screenWidth / 2 + 'px',
    top: -screenHeight / 2 + 'px'
});

// 设置窗口标题
$title.text(config.TITLE);

// 判断是否是全屏状态
function isFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        return false;
    } else {
        return true;
    }
}

// 切换窗口模式
function toggleFullscreen() {
    var element = document.documentElement;
    if (isFullscreen()) {
        if(document.cancelFullScreen) {
            document.cancelFullScreen();
        } if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    } else {
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
}

// 窗口自适应
function resizeScreen() {
    var width = $window.width();
        height = $window.height();
    var screenRatio = screenWidth / screenHeight,
        windowRatio = width / height,
        noStretch = true;
    if (screenRatio > windowRatio) {
        var scale = width / screenWidth;
    } else {
        var scale = height / screenHeight;
    }
    scale = util.ceil(scale, 3);
    $gameContainer.css({'-webkit-transform':'scale(' + scale + ')',
        'transform':'scale(' + scale + ')'});
}
resizeScreen();
$(window).on('resize', resizeScreen);

return {
    $gameContainer: $gameContainer,
    isFullscreen: isFullscreen,
    toggleFullscreen: toggleFullscreen
}

});