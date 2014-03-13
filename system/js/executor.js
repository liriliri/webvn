// 命令执行
define(['cmd/bg', 'cmd/bgm', 'cmd/comment', 'cmd/default', 'cmd/dialog',
	'cmd/face', 'cmd/fg', 'cmd/jump', 'cmd/se', 'cmd/voice', 'cmd/weather'], function() {

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
    } else {
    	return this['默认'].run(cmd, cmdParam);
    }
}

return exports;

});