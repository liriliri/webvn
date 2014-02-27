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

return {
    ceil: ceil
}

});