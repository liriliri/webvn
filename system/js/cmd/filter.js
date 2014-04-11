// 滤镜命令
define(['game/filter', 'cmd/cmd'], function (filter, CMD) {

var exports = new CMD('滤镜'),
    filterName = 'none';

exports.runWithNoParam = function (cmdParam) {
    switch(cmdParam) {
    case '清除':
        filter.clearFilter();
        break;
    default:
        break;
    }
    return true;
}

exports.runWithParam = function (subCmd, param) {
    switch(subCmd) {
    case '灰度':
        filterName = 'grayscale';
        break;
    case '怀旧':
        filterName = 'sepia';
        break;
    case '饱和度':
        filterName = 'saturate';
        break;
    case '色相':
        filterName = 'hue-rotate';
        break;
    case '反色':
        filterName = 'invert';
        break;
    case '透明度':
        filterName = 'opacity';
        break;
    case '亮度':
        filterName = 'brightness';
        break;
    case '对比度':
        filterName = 'contrast';
        break;
    case '模糊':
        filterName = 'blur';
        break;
    default:
        break;
    }
    filter.setFilter(filterName, param);
    return true;
}

return exports;

});