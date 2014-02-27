// 音乐基础模块
define(function() {

var p = Sound.prototype;

function Sound(id) {
    this.audio = document.getElementById(id);
}

p.play = function() {
    this.audio.play();
}

p.pause = function() {
    this.audio.pause();
}

p.setLoop = function(flag) {
    this.audio.loop = flag;
}

p.stop = function() {
    this.pause();
    this.audio.currentTime = 0;
}

return Sound;

});