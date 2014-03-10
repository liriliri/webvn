// 天气命令
define(['cmd/cmd', 'game/effect'], function(CMD, effect) {

var exports = new CMD('天气');

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '起雾':
        effect.setEffect('fog');
        break;
    case '下雪':
        effect.setEffect('snow');
        break;
    case '下雨':
        effect.setEffect('rain');
        break;
    case '晴朗':
        effect.stop();
    default:
        break;
    }
    return true; // 继续执行下条命令
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