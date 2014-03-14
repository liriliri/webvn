// 视频模块
define(['game/name'], function(url) {

var clickHandler = null,
    finishCallBack = null,
    video = document.getElementById('video'),
    $video = $('#video');

// 隐藏
function hide() {
    $video.addClass('hidden');
    return this;
}

// 加载
function load(name) {
    video.src = url.video(name);
}

// 加载并播放
function loadAndPlay(name) {
    load(name);
    play();
    return this;
}

// 播放
function play() {
    video.play();
}

// 设置点击处理函数
function setClickHandler(handler) {
    $video.off('click');
    clickHandler = handler;
    $video.on('click', handler);
    return this;
}

// 设置结束回调函数
function setFinishCallback(callback) {
    $video.off('ended');
    finishCallBack = callback;
    $video.on('ended', callback);
    return this;
}
setFinishCallback(function() {
    hide();
});

function setVolume(volume) {
    video.volume = volume;
}

// 显示
function show() {
    $video.removeClass('hidden');
    return this;
}

// 停止
function stop() {
    video.pause();
    if (finishCallBack !== null) {
        finishCallBack();
    }
}

return {
    hide: hide,
    load: load,
    loadAndPlay: loadAndPlay,
    play: play,
    setClickHandler: setClickHandler,
    setFinishCallback: setFinishCallback,
    setVolume: setVolume,
    show: show,
    stop: stop
}

});