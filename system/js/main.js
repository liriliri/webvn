// requireJs配置文件
require.config({
    baseUrl: 'system/js',
    paths: {
        'script': '../../script'
    }
});

// 程序主入口
define(['nav', 'screen', 'logo', 'video', 'config', 'mainmenu', 'connector'], function(nav, screen, logo, video, config, mainmenu, connector) {

// 显示OP
function showOp() {
    video
    .show()
    .loadAndPlay('data/video/opening.mp4')
    .setFinishCallback(function() {
        video.hide();
        mainmenu.fadeIn();
    })
    .setClickHandler(function() {
        video.stop();
    });
}

// 显示Logo
if (logo.isActivated) {
    logo.fadeIn();
    setTimeout(function() {
        // 在指定时间后显示OP
        logo.fadeOut();
        if (config.OP_OR_NOT) {
            showOp();
        } else {
            mainmenu.fadeIn();
        }
    }, logo.duration);
} else if (config.OP_OR_NOT) {
    showOp();
} else {
    mainmenu.fadeIn();
}

});