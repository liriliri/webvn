// 命令执行
define(['cmd/bg'], function() {

var cmdNum = arguments.length, // 支持的命令数目
    exports = {},
    i;

for (i = 0; i < cmdNum; i++) {
    exports[arguments[i].name] = arguments[i];
}

exports.run = function (cmd, cmdParam) {
    if (this[cmd]) {
        // 执行并返回结果
        return this[cmd].run(cmdParam);
    }
}

return exports;

});