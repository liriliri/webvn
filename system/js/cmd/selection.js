// 选择命令
define(['cmd/cmd', 'game/selection', 'util'],
    function(CMD, selection, util) {

var exports = new CMD('选择'),
    selections = null, result,
    i, len;

exports.run = function (cmdParam) {
    selections = cmdParam.split("，");
    result = [];
    for (i = 0, len = selections.length; i < len; i++) {
        selections[i] = util.getCmdAndParam(selections[i]);
        result.push({
            title: selections[i][0],
            target: selections[i][1]
        });
    }
    selection.setSelections(result);
    return false;
}

exports.runWithNoParam = function (cmdParam) {
    switch (cmdParam) {
        default:
            break;
    };
    return true;
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