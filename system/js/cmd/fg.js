// 立绘命令
define(['game/fg', 'cmd/cmd'], function(fg, CMD) {

var exports = new CMD('立绘');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '显示':
        fg.fadeIn();
        break;
    case '隐藏':
        fg.fadeOut();
    default:
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '选择':
        fg.select(+param);
        break;
    case '位置':
        fg.setPosition(param);
        break;
    default:
        fg.load(subCmd, param);
        break;
    }
    return true;
}

return exports;

});