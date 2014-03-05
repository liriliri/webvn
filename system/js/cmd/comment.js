// 注释命令
define(['cmd/cmd'], function(CMD) {

var exports = new CMD('注释');

exports.runWithNoParam = function (cmdParam) {
    return true;
}

exports.runWithParam = function (subCmd, param) {
    return true;
}

return exports;

});