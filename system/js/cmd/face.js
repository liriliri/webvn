// 表情命令
define(['cmd/cmd', 'game/face'], function(CMD, face) {

var exports = new CMD('表情');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '显示':
        face.show();
        break;
    case '隐藏':
        face.hide();
        break;
    default:
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    default:
        face.load(subCmd, param);
        break;
    }
    return true;
}

return exports;

});