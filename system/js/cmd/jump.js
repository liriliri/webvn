// 跳转命令
define(['cmd/cmd'], function(CMD) {

var exports = new CMD('跳转');

exports.runWithNoParam = function (cmdParam) {
    if (isNaN(Number(cmdParam))) {
        return function () {
            this.jumpToLabel(cmdParam);
        };
    } else {
        return function () {
            this.execute(cmdParam);
        }
    }
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    default:
        break;
    }
    return true;
}

return exports;

});