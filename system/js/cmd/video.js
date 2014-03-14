// 视频命令
define(['game/video', 'cmd/cmd'], function (video, CMD) {

var exports = new CMD('视频');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '禁止跳过':
        video.setClickHandler(function () {});
        return true;
        break;
    case '允许跳过':
        video.setClickHandler(function () {
            video.stop();
        });
        return true;
        break;
    default:
        video
        .show()
        .loadAndPlay(cmdParam);
        return false;
        break;
    }
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '音量':
        video.setVolume(param / 100);
        return true;
        break;
    default:
        break;
    }
}

return exports;

});