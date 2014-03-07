// 对话框命令
define(['game/dialog', 'cmd/cmd'], function (dialog, CMD) {

var exports = new CMD('对话框');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '显示':
    	dialog.show();
    	break;
    case '隐藏':
    	dialog.hide();
    	break;
    default:
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '样式':
    	dialog.setStyle(param);
    	break;
    default:
        break;
    }
    return true;
}

return exports;

});