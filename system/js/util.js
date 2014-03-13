// 公共方法
define(function() {

/**
 * 进位取整
 * @param {Number} num 要取整的数字
 * @param {Number} precision 精度
 * @returns {Number} 结果
 */
var ceil = function(num, precision) {
    var multiplier = Math.pow(10, precision);
    return Math.ceil(num * multiplier) /multiplier;
}

// 提取命令及其参数
var getCmdAndParam = function (cmdParam) {
    var bracketLeft = cmdParam.indexOf('（'),
        bracketRight = cmdParam.indexOf('）'),
        result = [];
    result[0] = cmdParam.slice(0, bracketLeft);
    result[1] = cmdParam.slice(bracketLeft + 1, bracketRight);
    return result;
}

// 获取对象名及其值
var getValue = function (o) {
	var i, result = [];
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			result.push({
				name: i,
				value: o[i]
			});
;		}
	}
	return result;
}

return {
    ceil: ceil,
    getCmdAndParam: getCmdAndParam,
    getValue: getValue
}

});