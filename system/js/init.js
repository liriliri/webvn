// 初始化模块
define(['nav', 'screen', 'logo', 'video', 'config', 'mainmenu'], function(nav, screen, logo, video, config, mainmenu) {

// 显示Logo
if (logo.isActivated) {
    logo.fadeIn();
    setTimeout(function() {
        // 在指定时间后显示OP
        logo.fadeOut();
        if (config.OP_OR_NOT) {
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
        } else {
            mainmenu.fadeIn();
        }
    }, logo.duration);
} else {
    mainmenu.fadeIn();
}

});