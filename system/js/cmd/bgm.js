// 声音命令
define(['sound/bgm', 'cmd/cmd'], function (bgm, CMD) {

var exports = new CMD('背景乐');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '停止':
        bgm.stop();
        break;
    case '暂停':
        bgm.pause();
        break;
    case '播放':
        bgm.play();
        break;
    case '单曲':
        bgm.setLoop(false);
        break;
    case '循环':
        bgm.setLoop(true);
        break;
    default:
        // 加载音乐
        bgm.loadAndPlay(cmdParam);
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '音量':
        bgm.setVolume(param / 100);
        break;
    default:
        break;
    }
    return true;
}

return exports;

});