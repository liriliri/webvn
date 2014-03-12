// 默认命令
define(['game/dialog', 'cmd/cmd'], function(dialog, CMD) {

var exports = new CMD('默认');

exports.run = function (cmd, cmdParam) {
    dialog.setName(cmd);
    // 查看命令是否带有参数
    if (cmdParam.match('（.*）')) {
        var cmd = util.getCmdAndParam(cmdParam);
        return this.runWithParam(cmd[0], cmd[1]);
    } else {
        return this.runWithNoParam(cmdParam);
    }
}

exports.runWithNoParam = function (cmdParam) {
    dialog.setText(cmdParam);
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    default:
        break;
    }
}

return exports;

});