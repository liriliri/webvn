// 背景
define(['game/bg', 'util'], function(bg, util) {

var exports = {};

exports.name = '背景';

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
    default:
        // 加载图片
        bg.load(cmdParam);
        break;
    }
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '过渡效果':
        bg.setTransType(param);
        break;
    case '过渡时间':
        bg.setTransTime(param);
        break;
    default:
        break;
    }
}

return exports;

});