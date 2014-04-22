// 重置游戏画面和声音
define(['sound/bgm', 'sound/voice', 'sound/se', 'game/dialog', 'game/face', 'game/effect', 'game/filter', 'game/fg'],
    function (bgm, voice, se, dialog, face, effect, filter, fg) {

return function () {
    bgm.stop();
    voice.stop();
    se.stop();
    face.hide();
    dialog.hide();
    effect.stop();
    filter.clearFilter();
    fg.resetAll();
};

});