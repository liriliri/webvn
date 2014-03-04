// 名字提取器
define(['config', 'script/macro'], function (config, macro) {

var bgPath = config.BG_PATH,
    bgType = config.BG_TYPE,
    bgmPath = config.BGM_PATH,
    bgmType = config.BGM_TYPE,
    result;

function bg(name) {
    if (macro.BG[name]) {
        return bgPath + macro.BG[name] + bgType;
    } else {
        return bgPath + name + bgType;
    }
}

function bgm(name) {
    if (macro.BGM[name]) {
        return bgmPath + macro.BGM[name] + bgmType;
    } else {
        return bgmPath + name + bgmType;
    }
}

return {
    bg: bg,
    bgm: bgm
}

});