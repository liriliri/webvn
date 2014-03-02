// 游戏脚本
define(['executor', 'script/0', 'script/1'], function (executor) {

var cmdNum, // 命令总数
    cmd, // 命令
    cmdParam, // 命令参数
    nextCmd = 0, // 当前正在执行的脚本序号
    i,
    labels = {}, // 标签
    line, // 单行脚本
    scriptNum = arguments.length, // 脚本数目
    script = [],
    seperatorPos; // 分割符位置

// 加载脚本
for (i = 1; i < scriptNum; i++) {
    script = script.concat(arguments[i]);
}

// 初始化命令总数
cmdNum = script.length;

// 加载标签
for (i = 0; i < cmdNum; i++) {
    loadCommand(i);
    if (cmd === '标签') {
        labels[cmdParam] = i;
    }
}

/**
 * 执行脚本
 * @param {Number} num 脚本号
 */
function execute(num) {
    if (typeof num !== 'Number') {
        num = nextCmd;
    }
    // 如果脚本达到末尾则跳转到主菜单
    if (num >= cmdNum) {
        return;
    }
    nextCmd = num + 1;
    loadCommand(num);
    console.log(cmd, cmdParam);
    // 执行命令，如果返回结果为true则继续执行下一语句
    if (executor.run(cmd, cmdParam) === true) {
        execute();
    }
}

/**
 * 解析命令参数
 * @param {String} num 脚本号
 */
function loadCommand(num) {
    line = script[num];
    seperatorPos = line.indexOf('：');
    cmd = $.trim(line.slice(0, seperatorPos));
    cmdParam = $.trim(line.slice(seperatorPos + 1));
}

// 开始游戏
function start() {
    execute(0);
}

return {
    execute: execute,
    start: start
};

});