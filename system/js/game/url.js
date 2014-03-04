// 名字提取器
define(['config', 'script/macro'], function (config, macro) {

var bgPath = config.BG_PATH,
    bgType = config.BG_TYPE,
    bgmPath = config.BGM_PATH,
    bgmType = config.BGM_TYPE,
    sePath = config.SE_PATH,
    seType = config.SE_TYPE,
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

function se(name) {
    if (macro.SE[name]) {
        return sePath + macro.SE[name] + seType;
    } else {
        return sePath + name + seType;
    }
}

return {
    bg: bg,
    bgm: bgm,
    se: se
}

});