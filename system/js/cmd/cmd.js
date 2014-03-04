// 命令通用类
define(['util'], function (util) {

var p = CMD.prototype;

function CMD(name) {
    this.name = name;
}

p.run = function (cmdParam) {
    // 查看命令是否带有参数
    if (cmdParam.match('（.*）')) {
        var cmd = util.getCmdAndParam(cmdParam);
        return this.runWithParam(cmd[0], cmd[1]);
    } else {
        return this.runWithNoParam(cmdParam);
    }
    return true;
}

p.runWithNoParam = function () {};

p.runWithParam = function () {};

return CMD;

});