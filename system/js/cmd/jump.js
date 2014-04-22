// 跳转命令
define(['cmd/cmd', 'connector'],
    function(CMD, connector) {

var exports = new CMD('跳转');

exports.runWithNoParam = function (cmdParam) {
    switch (cmdParam) {
    case '主菜单':
        connector.trigger('showMainmenu');
        return false;
        break;
    default:
         break;
    };
    if (isNaN(Number(cmdParam))) {
        connector.trigger('jumpToLabel', cmdParam);
        return false;
    } else {
        connector.trigger('execute', Number(cmdParam));
        return false;
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