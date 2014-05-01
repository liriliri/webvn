// 游戏脚本
define(['executor', 'config', 'connector', 'script/0', 'script/1'],
    function (executor, config, connector) {

var cmdNum, // 命令总数
    cmd, // 命令
    cmdParam, // 命令参数
    cmdSeparator = config.CMD_SEPARATOR, // 命令分隔符
    nextCmd = 0, // 当前正在执行的脚本序号
    i,
    isClickenabled = true, // 是否允许点击
	isPlaying = false, // 是否正在执行游戏
    labels = {}, // 标签
    line, // 单行脚本
    scriptNum = arguments.length, // 脚本数目
    script = [],
    seperatorPos; // 分割符位置

// 加载脚本
for (i = 3; i < scriptNum; i++) {
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

// 禁止点击或按键时执行脚本
function noClick(num) {
	// 必须使用定时以确保不被覆写
	setTimeout(function () {
		isClickenabled = false;
	}, 150);
	if (num !== 0) {
		setTimeout(function () {
            isClickenabled = true;
        }, num);
	}
}
connector.on('noClick', noClick);

// 允许点击
function enableClick() {
	isClickenabled = true;
}
connector.on('enableClick', enableClick);

/**
 * 执行脚本
 * @param {Number} num 脚本号
 */
function execute(num) {
    if (isNaN(num)) {
        num = nextCmd;
    }
    // 如果脚本达到末尾则跳转到主菜单
    if (num >= cmdNum) {
        connector.trigger('showMainmenu');
        return;
    }
    nextCmd = num + 1;
    loadCommand(num);
    console.log(cmd, cmdParam);
    var result = executor.run(cmd, cmdParam);
    // 执行命令，如果返回结果为true则继续执行下一语句
    if (result === true) {
        execute();
    }
}
connector.on('execute', execute);

// 回退
function goBack(num) {
    nextCmd -= num;
}

// 点击时触的事件
function handleClick() {
    if (isClickenabled === true && isPlaying === true) {
        execute();
        // 限制点击次数
        isClickenabled = false;
        clickTimer = setTimeout(function () {
            isClickenabled = true;
        }, 100);
    }
}
connector.on('gameClicked', handleClick);

// 跳转到标签
function jumpToLabel(labelName) {
	if (labels[labelName]) {
		execute(labels[labelName]);
	}
}
connector.on('jumpToLabel', jumpToLabel);

/**
 * 解析命令参数
 * @param {String} num 脚本号
 */
function loadCommand(num) {
    line = script[num];
    seperatorPos = line.indexOf(cmdSeparator);
    cmd = $.trim(line.slice(0, seperatorPos));
    cmdParam = $.trim(line.slice(seperatorPos + 1));
}

// 开始游戏
function start() {
	isPlaying = true;
    execute(0);
}

// 结束游戏
function stop() {
	isPlaying = false;
}

var exports = {
    execute: execute,
    goBack: goBack,
    handleClick: handleClick,
    jumpToLabel: jumpToLabel,
    start: start,
	stop: stop
};

return exports;

});