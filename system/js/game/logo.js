define(['config'], function(config) {

var $logo = $('#logo'),
    animetionDuration = config.ANIMATION_DURATION,
    duration = config.LOGO_DURATION,
    isActivated = config.LOGO_OR_NOT;

// 显示LOGO
function fadeIn() {
    $logo.fadeIn(animetionDuration);
}

// 隐藏LOGO
function fadeOut() {
    $logo.fadeOut(animetionDuration);
}

return {
    duration: duration,
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    isActivated: isActivated
}

});