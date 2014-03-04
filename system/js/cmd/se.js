// 声音命令
define(['sound/se', 'cmd/cmd'], function (se, CMD) {

var exports = new CMD('音效');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '停止':
        se.stop();
        break;
    case '暂停':
        se.pause();
        break;
    case '播放':
        se.play();
        break;
    case '单曲':
        se.setLoop(false);
        break;
    case '循环':
        se.setLoop(true);
        break;
    default:
        // 加载音乐
        se.loadAndPlay(cmdParam);
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '音量':
        se.setVolume(param / 100);
        break;
    default:
        break;
    }
    return true;
}

return exports;

});