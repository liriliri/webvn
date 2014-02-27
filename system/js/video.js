// 视频模块
define(function() {

var clickHandler = null,
    finishCallBack = null,
    video = document.getElementById('video'),
    $video = $('#video');

// 隐藏
function hide() {
    $video.addClass('hidden');
}

// 加载
function load(url) {
    video.src = url;
}

// 加载并播放
function loadAndPlay(url) {
    load(url);
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
    show: show,
    stop: stop
}

});