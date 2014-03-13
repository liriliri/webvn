// 背景乐模块
define(['sound/sound', 'config', 'game/name'], function(Sound, config, url) {

var exports = new Sound('se');

exports.setLoop(false);

exports.load = function(name) {
    this.audio.src = url.se(name);
    this.loaded = true;
}

exports.loadAndPlay = function(name) {
    this.load(name);
    this.play();
}

return exports;

});