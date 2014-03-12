// 默认命令
define(['game/dialog', 'sound/voice', 'cmd/cmd', 'util'], function(dialog, voice, CMD, util) {

var exports = new CMD('默认');

exports.run = function (cmd, cmdParam) {
    dialog.setName(cmd);
    // 查看命令是否带有参数
    if (cmdParam.match('（.*）')) {
        var command = util.getCmdAndParam(cmdParam);
        return this.runWithParam(cmd, command[0], command[1]);
    } else {
        return this.runWithNoParam(cmdParam);
    }
}

exports.runWithNoParam = function (cmdParam) {
    dialog.setText(cmdParam);
    return false;
}

exports.runWithParam = function (cmd, subCmd, param) {
    dialog.setText(subCmd);
    voice.loadAndPlay(cmd, param);
    return false;
}

return exports;

});