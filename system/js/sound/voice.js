// 背景乐模块
define(['sound/sound', 'config', 'game/name'], function(Sound, config, url) {

var exports = new Sound('voice');

exports.setLoop(false);

exports.load = function(ch, name) {
    this.audio.src = url.voice(ch, name);
}

exports.loadAndPlay = function(ch, name) {
    this.load(ch, name);
    this.play();
}

return exports;

});