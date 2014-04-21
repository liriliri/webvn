// 默认命令
define(['game/dialog', 'sound/voice', 'cmd/cmd', 'util'], function(dialog, voice, CMD, util) {

var exports = new CMD('默认'),
    command = '', // 命令
    result = true; // 执行结果

// 回退1个命令
var goBackOne = function () {
    this.goBack(1);
}

exports.run = function (cmd, cmdParam) {
    dialog.setName(cmd);
    // 查看命令是否带有参数
    if (cmdParam.match('（.*）')) {
        command = util.getCmdAndParam(cmdParam);
        return this.runWithParam(cmd, command[0], command[1]);
    } else {
        return this.runWithNoParam(cmdParam);
    }
}

exports.runWithNoParam = function (cmdParam) {
    result = dialog.setText(cmdParam);
    if (result === false) {
        return goBackOne;
    } else {
        return false;
    }
}

exports.runWithParam = function (cmd, subCmd, param) {
    result = dialog.setText(subCmd);
    voice.loadAndPlay(cmd, param);
    if (result === false) {
        return goBackOne;
    } else {
        return false;
    }
}

return exports;

});