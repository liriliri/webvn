// 声音命令
define(['sound/bgm', 'util'], function (bgm, util) {

var exports = {};

exports.name = '背景乐';

exports.run = function (cmdParam) {
    // 查看命令是否带有参数
    if (cmdParam.match('（.*）')) {
        var cmd = util.getCmdAndParam(cmdParam);
        this.runWithParam(cmd[0], cmd[1]);
    } else {
        this.runWithNoParam(cmdParam);
    }
    return true;
}

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
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '音量':
        bgm.setVolume(param / 100);
        break;
    default:
        break;
    }
}

return exports;

});