// 背景乐模块
define(['sound/sound', 'config'], function(Sound, config) {

var exports = new Sound('bgm');

exports.path = config.BGM_PATH;
exports.extention = config.BGM_EXTENTION;
exports.setLoop(true);

exports.load = function(name) {
    var url = this.path + name + this.extention;
    this.audio.src = url;
}

exports.loadAndPlay = function(name) {
    this.load(name);
    this.play();
}

return exports;

});