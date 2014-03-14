// 滤镜模块
define(function () {

var $target = $('#click-area'),
	filter, filters;

/** 
 * 设置画布滤镜
 * @param {String} filterName 滤镜名
 * @param {String} intensity 强度
 */
function setFilter(filterName, intensity) {
    filter = filterName + '(' + intensity + ')';
    filters = $target.css('-webkit-filter');
    if (filters === 'none') {
        filters = '';
    }
    var filters = filters + ' ' + filter;
    $target.css({'-webkit-filter': filters});
}

// 清除画布滤镜
function clearFilter() {
    $target.css({'-webkit-filter':'none'});
}

return {
	clearFilter: clearFilter,
	setFilter: setFilter
}

});