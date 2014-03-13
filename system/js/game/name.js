// 名字提取器
define(['config', 'script/macro'], function (config, macro) {

var bgPath = config.BG_PATH,
    bgType = config.BG_TYPE,
    bgmPath = config.BGM_PATH,
    bgmType = config.BGM_TYPE,
    facePath = config.FACE_PATH,
    faceType = config.FACE_TYPE,
    fgPath = config.FIGURE_PATH,
    fgType = config.FIGURE_TYPE,
    sePath = config.SE_PATH,
    seType = config.SE_TYPE,
    voicePath = config.VOICE_PATH,
    voiceType = config.VOICE_TYPE,
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

function cg(name) {
    return bgPath + name + bgType;
}

function dialogStyle(name) {
    if (macro.DIALOG_STYLE[name]) {
        return macro.DIALOG_STYLE[name];
    } else {
        return name;
    }
}

function face(name, type) {
    var result = macro.CH[name];
    if (result) {
        result = facePath + result + '/';
        if (macro.FACE[name][type]) {
            return result + macro.FACE[name][type] + faceType;
        }
    }
}

function fg(name, type) {
    var result = macro.CH[name];
    if (result) {
        result = fgPath + result + '/';
        if (macro.FG[name][type]) {
            return result + macro.FG[name][type] + fgType;
        }
    }
}

function se(name) {
    if (macro.SE[name]) {
        return sePath + macro.SE[name] + seType;
    } else {
        return sePath + name + seType;
    }
}

function voice(ch, name) {
    if (macro.CH[ch]) {
        return voicePath + macro.CH[ch] + '/' + name + voiceType;
    }
}

return {
    bg: bg,
    bgm: bgm,
    cg: cg,
    dialogStyle: dialogStyle,
    face: face,
    fg: fg,
    se: se,
    voice: voice
}

});