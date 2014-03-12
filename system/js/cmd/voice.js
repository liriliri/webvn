// 语音命令
define(['sound/voice', 'cmd/cmd'], function (voice, CMD) {

var exports = new CMD('语音');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '停止':
        voice.stop();
        break;
    case '暂停':
        voice.pause();
        break;
    case '播放':
        voice.play();
        break;
    default:
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '音量':
        voice.setVolume(param / 100);
        break;
    default:
        voice.loadAndPlay(subCmd, param);
        break;
    }
    return true;
}

return exports;

});