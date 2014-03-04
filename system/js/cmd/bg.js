// 背景命令
define(['game/bg', 'cmd/cmd'], function(bg, CMD) {

var exports = new CMD('背景');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    default:
        // 加载图片
        bg.load(cmdParam);
        break;
    }
    return true; // 继续执行下条命令
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
    return true;
}

return exports;

});